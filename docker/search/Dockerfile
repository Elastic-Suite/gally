ARG OPENSEARCH2_VERSION=2.16.0
ARG ELASTIC7_VERSION=7.16.3
ARG ELASTIC8_VERSION=8.10.4

FROM opensearchproject/opensearch:${OPENSEARCH2_VERSION} AS gally_opensearch2

WORKDIR /usr/share/opensearch

RUN bin/opensearch-plugin install -b analysis-phonetic
RUN bin/opensearch-plugin install -b analysis-icu
RUN bin/opensearch-plugin install -b ingest-attachment

FROM docker.elastic.co/elasticsearch/elasticsearch:${ELASTIC7_VERSION} AS gally_elasticsearch7

WORKDIR /usr/share/elasticsearch

RUN bin/opensearch-plugin install -b analysis-phonetic
RUN bin/opensearch-plugin install -b analysis-icu
RUN bin/opensearch-plugin install -b ingest-attachment

FROM docker.elastic.co/elasticsearch/elasticsearch:${ELASTIC8_VERSION} AS gally_elasticsearch8

WORKDIR /usr/share/elasticsearch

RUN bin/opensearch-plugin install -b analysis-phonetic
RUN bin/opensearch-plugin install -b analysis-icu
RUN bin/opensearch-plugin install -b ingest-attachment

FROM amazonlinux:2 AS gally_opensearch2_gpu_builder

ARG OPENSEARCH2_VERSION
ARG UID=1000
ARG GID=1000
ARG TEMP_DIR=/tmp/opensearch
ARG OPENSEARCH_HOME=/usr/share/opensearch
ARG OPENSEARCH_PATH_CONF=$OPENSEARCH_HOME/config
ARG SECURITY_PLUGIN_DIR=$OPENSEARCH_HOME/plugins/opensearch-security
ARG PERFORMANCE_ANALYZER_PLUGIN_CONFIG_DIR=$OPENSEARCH_PATH_CONF/opensearch-performance-analyzer
ARG OS_VERSION=${OPENSEARCH2_VERSION}
# Update packages
# Install the tools we need: tar and gzip to unpack the OpenSearch tarball, and shadow-utils to give us `groupadd` and `useradd`.
# Install which to allow running of securityadmin.sh
RUN yum update -y && yum install -y tar gzip shadow-utils which && yum clean all

# Create an opensearch user, group, and directory
RUN groupadd -g $GID opensearch && \
    adduser -u $UID -g $GID -d $OPENSEARCH_HOME opensearch && \
    mkdir $TEMP_DIR

RUN mkdir /usr/share/elasticsearch
WORKDIR /usr/share/elasticsearch

RUN set -eux ; \
    cur_arch="" ; \
    case "$(arch)" in \
        aarch64) cur_arch='arm64' ;; \
        x86_64)  cur_arch='x64' ;; \
        *) echo >&2 ; echo >&2 "Unsupported architecture $(arch)" ; echo >&2 ; exit 1 ;; \
    esac ; \
    curl --retry 10 -S -L --output $TEMP_DIR/opensearch.tar.gz https://artifacts.opensearch.org/releases/bundle/opensearch/$OS_VERSION/opensearch-$OS_VERSION-linux-$cur_arch.tar.gz; \
    curl --output $TEMP_DIR/opensearch.pgp https://artifacts.opensearch.org/publickeys/opensearch.pgp; \
    gpg --import $TEMP_DIR/opensearch.pgp; \
    curl --output $TEMP_DIR/opensearch.tar.gz.sig https://artifacts.opensearch.org/releases/bundle/opensearch/$OS_VERSION/opensearch-$OS_VERSION-linux-$cur_arch.tar.gz.sig; \
    gpg --verify $TEMP_DIR/opensearch.tar.gz.sig $TEMP_DIR/opensearch.tar.gz;

RUN tar --warning=no-timestamp -zxf $TEMP_DIR/opensearch.tar.gz -C $OPENSEARCH_HOME --strip-components=1 && \
    mkdir -p $OPENSEARCH_HOME/data && chown -Rv $UID:$GID $OPENSEARCH_HOME/data && \
    if [[ -d $SECURITY_PLUGIN_DIR ]] ; then chmod -v 750 $SECURITY_PLUGIN_DIR/tools/* ; fi && \
    rm -rf $TEMP_DIR

COPY ./config/* $OPENSEARCH_PATH_CONF/
COPY ./bin/* $OPENSEARCH_HOME/
RUN if [[ -d $PERFORMANCE_ANALYZER_PLUGIN_CONFIG_DIR ]] ; then mv $OPENSEARCH_PATH_CONF/performance-analyzer.properties $PERFORMANCE_ANALYZER_PLUGIN_CONFIG_DIR/ ; fi

FROM nvidia/cuda:12.0.0-base-centos7 AS gally_opensearch2_gpu

ARG UID=1000
ARG GID=1000
ARG OPENSEARCH_HOME=/usr/share/opensearch
ARG OS_VERSION=2.5.0

RUN yum update -y && yum install -y tar gzip shadow-utils which && yum clean all

# Create an opensearch user, group
RUN groupadd -g $GID opensearch && \
    adduser -u $UID -g $GID -d $OPENSEARCH_HOME opensearch

# Copy from Stage0
COPY --from=gally_opensearch2_gpu_builder --chown=$UID:$GID $OPENSEARCH_HOME $OPENSEARCH_HOME
WORKDIR $OPENSEARCH_HOME

# Set $JAVA_HOME
RUN echo "export JAVA_HOME=$OPENSEARCH_HOME/jdk" >> /etc/profile.d/java_home.sh && \
    echo "export PATH=\$PATH:\$JAVA_HOME/bin" >> /etc/profile.d/java_home.sh
ENV JAVA_HOME=$OPENSEARCH_HOME/jdk
ENV PATH=$PATH:$JAVA_HOME/bin:$OPENSEARCH_HOME/bin

# Add k-NN lib directory to library loading path variable
ENV LD_LIBRARY_PATH="$LD_LIBRARY_PATH:$OPENSEARCH_HOME/plugins/opensearch-knn/lib"

# Change user
USER $UID

# Setup OpenSearch
# Disable security demo installation during image build, and allow user to disable during startup of the container
# Enable security plugin during image build, and allow user to disable during startup of the container
ARG DISABLE_INSTALL_DEMO_CONFIG=true
ARG DISABLE_SECURITY_PLUGIN=false
RUN ./opensearch-onetime-setup.sh

RUN bin/opensearch-plugin install -b analysis-phonetic
RUN bin/opensearch-plugin install -b analysis-icu
RUN bin/opensearch-plugin install -b ingest-attachment

EXPOSE 9200 9300 9600 9650

# Label
LABEL org.label-schema.schema-version="1.0" \
  org.label-schema.name="opensearch" \
  org.label-schema.version="$OS_VERSION" \
  org.label-schema.url="https://opensearch.org" \
  org.label-schema.vcs-url="https://github.com/OpenSearch" \
  org.label-schema.license="Apache-2.0" \
  org.label-schema.vendor="OpenSearch"

# CMD to run
ENTRYPOINT ["./opensearch-docker-entrypoint.sh"]
CMD ["opensearch"]
