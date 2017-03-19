#!/bin/bash

Briskhome="briskhome"

InstallDir="/opt/briskhome"
Repository="https://github.com/heuels/briskhome.git"

# Create $InstallDir if it not exists or fail if it does.

getent group $Briskhome
if [ $? -ne 0 ]; then
  groupadd $Briskhome
  useradd $Briskhome -p $Briskhome -m -g $Briskhome
fi

# TODO: Fail
if [ ! -d $InstallDir ]; then
  mkdir -p $InstallDir;
fi;

cd $InstallDir || exit(1)
git clone $Repository
chown -R $Briskhome:$Briskhome $InstallDir

# If systemd is used
cp $InstallDir/etc/briskhome.service "/etc/systemd/system"
# systemctl enable briskhome.service
