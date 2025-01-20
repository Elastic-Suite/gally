FROM debian:12

# Enable systemd.
RUN apt-get update ; \
    apt-get install -y acl apt-transport-https ca-certificates curl gettext gnupg lsb-release systemd systemd-sysv libfcgi-bin file gettext git patch sudo rsync net-tools vim   ; \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* ; \
    rm -rf /lib/systemd/system/multi-user.target.wants/* ; \
    rm -rf /etc/systemd/system/*.wants/* ; \
    rm -rf /lib/systemd/system/local-fs.target.wants/* ; \
    rm -rf /lib/systemd/system/sockets.target.wants/*udev* ; \
    rm -rf /lib/systemd/system/sockets.target.wants/*initctl* ; \
    rm -rf /lib/systemd/system/sysinit.target.wants/systemd-tmpfiles-setup* ; \
    rm -rf /lib/systemd/system/systemd-update-utmp*

COPY install.sh /usr/bin/

WORKDIR /var/install

RUN adduser www-data sudo

CMD ["/lib/systemd/systemd"]
