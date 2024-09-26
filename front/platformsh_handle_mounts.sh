#!/usr/bin/env bash

# This is a simple script for handling committed files and mounts on Platform.sh. Some application require write access to certain locations
# at runtime, and must be defined with mounts (https://docs.platform.sh/configuration/app/storage.html#mounts). One consequence of defining a
# location as a mount, however, is that when the location is mounted during the deploy hook, any files that may have been committed or modified
# during the build hook there will be overwritten by whatever exists in persistent storage for that environment.
#
# This script stages those files in a tmp directory (MOUNT_TMP) during the build hook, and then recopies them to their final location during the
# deploy hook to get around this. Call this script as the last line and first line in your build and deploy hooks, respectively.
#
# Limitations:
#   - Does not yet handles nested mounts well (i.e. `/.next/cache`), so best to use its parent directory in your mount definition (`/.next`).

MOUNT_TMP=platformsh-mounts

# Hidden mounts require a preceding slash (i.e. `/.next`). This function just removes it to make the path work right.
#   See: https://docs.platform.sh/configuration/app/storage.html#why-cant-i-mount-a-hidden-folder
clean_mount_defn(){
    MOUNT=$1
    if [[ ${MOUNT:0:1} == "/" ]] ; then echo "${MOUNT:1}"; else echo $MOUNT; fi
}

# During the build hook, this function moves files committed to the same directory as one defined in `.platform.app.yaml`
#   as a mount to the tmp directory MOUNT_TMP.
stage_files() {
    MOUNT=`clean_mount_defn $1`
    # Create the tmp directory (MOUNT_TMP) on the first pass only. (/app/platformsh-mounts on Platform.sh)
    if [ -d $PLATFORM_APP_DIR/$MOUNT_TMP ]; then
        mkdir $PLATFORM_APP_DIR/$MOUNT_TMP
    fi
    # Duplicate the mount directory in MOUNT_TMP.
    mkdir -p $PLATFORM_APP_DIR/$MOUNT_TMP/$MOUNT-tmp
    # Move its files.
    mv $PLATFORM_APP_DIR/$MOUNT/* $PLATFORM_APP_DIR/$MOUNT_TMP/$MOUNT-tmp
}

# During the deploy hook, this function moves files committed to the same directory as one defined in `.platform.app.yaml`
#   away from the tmp directory MOUNT_TMP back into their original location, which is now a mount with write-access at
#   deploy time.
restore_files() {
    MOUNT=`clean_mount_defn $1`
    if [ -d $PLATFORM_APP_DIR/$MOUNT_TMP/$MOUNT-tmp ]; then
        # Clean up files in mount so it's up to date with what we're moving over.
        rm -r $PLATFORM_APP_DIR/$MOUNT/*
        # Restore the directory's files.
        cp -r $PLATFORM_APP_DIR/$MOUNT_TMP/$MOUNT-tmp/* $PLATFORM_APP_DIR/$MOUNT
    fi
}

# Main function
run() {
    # Use PLATFORM_APPLICATION environment variable and jq to find all user-defined mounts.
    MOUNTS=$(echo $PLATFORM_APPLICATION | base64 --decode | jq '.mounts | keys')
    for mount in $(echo "${MOUNTS}" | jq -r '.[]'); do
        _jq() {
            # Build hook. The $PLATFORM_BRANCH environment variable is not available in build containers.
            if [ -z "${PLATFORM_BRANCH}" ]; then
                stage_files $mount
            # Deploy hook.
            else
                restore_files $mount
            fi
        }
        echo $(_jq)
    done
}

run
