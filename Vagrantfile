# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "debian/jessie64"
  config.vm.hostname = 'staging'
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  config.vm.network "forwarded_port",
    guest: 27017,
    host: 27017

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "10.10.0.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"
  config.vm.synced_folder "./", "/opt/briskhome"

  # config.ssh.username = "briskhome"
  # config.ssh.password = "briskhome"


  config.vm.provision "shell",
    inline: "sudo apt-get install -y puppet"

  config.vm.provision "shell",
    path: "./sys/modules/install.sh"

  config.vm.provision :puppet do |puppet|
    puppet.manifests_path = './sys/manifests'
    puppet.module_path    = './sys/modules'
    puppet.options        = '--verbose --debug'
  end
end
