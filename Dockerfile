FROM centos:7
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
ENV BRISKHOME_DIR /opt/briskhome

RUN yum install git gcc gcc-c++ make openssl-devel -y

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 8.5.0

# Install nvm with node and npm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.26.0/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# Set up our PATH correctly so we don't have to long-reference npm, node, &c.
ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN mkdir -p $BRISKHOME_DIR
WORKDIR ${BRISKHOME_DIR}

RUN curl -o- -L https://yarnpkg.com/install.sh | bash
ENV PATH "$PATH:~/.yarn/bin"


ADD package.json yarn.lock ./
RUN yarn
ADD . /opt/briskhome

EXPOSE 4000
CMD yarn start-watch
