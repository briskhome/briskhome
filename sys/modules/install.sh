#!/bin/bash
mkdir -p /etc/puppet/modules;

if [ ! -d /etc/puppet/modules/nvm ]; then
  puppet module install artberri-nvm --version 1.1.1
fi

if [ ! -d /etc/puppet/modules/motd ]; then
  puppet module install puppetlabs-motd --version 1.4.0
fi

if [ ! -d /etc/puppet/modules/apt ]; then
  puppet module install puppetlabs-apt --version 2.3.0
fi

if [ ! -d /etc/puppet/modules/mongodb ]; then
  puppet module install puppetlabs-mongodb --version 0.17.0
fi

# if [ ! -d /etc/puppet/modules/openldap ]; then
#   puppet module install camptocamp-openldap --version 1.15.0
# fi

# if [ ! -d /etc/puppet/modules/systemd ]; then
#   puppet module install camptocamp-systemd --version 0.4.0
# fi
