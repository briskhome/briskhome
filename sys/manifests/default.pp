#
#
#

group { 'briskhome':
  ensure => 'present',
  gid    => '555',
  name   => 'briskhome',
}

user { 'briskhome':
  ensure           => 'present',
  gid              => '555',
  name             => 'briskhome',
  home             => '/home/briskhome',
  password         => 'briskhome',
  password_max_age => '99999',
  password_min_age => '0',
  shell            => '/bin/bash',
  uid              => '555',
  managehome       => true,
}

file { '/home/briskhome/':
  ensure  => 'directory',
  owner   => 'briskhome',
  group   => 'briskhome',
  require => [
    User['briskhome'],
    Group['briskhome'],
  ],
}

# file { '/opt/briskhome/':
#   ensure  => 'directory',
#   owner   => 'briskhome',
#   group   => 'briskhome',
#   require => [
#     User['briskhome'],
#     Group['briskhome'],
#   ],
#   recurse => true,
# }

class { 'nvm':
  user         => 'briskhome',
  install_node => '7.8.0',
}

class { 'motd':
  content => '
     ██████╗ ██████╗ ██╗███████╗██╗  ██╗██╗  ██╗ ██████╗ ███╗   ███╗███████╗
     ██╔══██╗██╔══██╗██║██╔════╝██║ ██╔╝██║  ██║██╔═══██╗████╗ ████║██╔════╝
     ██████╔╝██████╔╝██║███████╗█████╔╝ ███████║██║   ██║██╔████╔██║█████╗
     ██╔══██╗██╔══██╗██║╚════██║██╔═██╗ ██╔══██║██║   ██║██║╚██╔╝██║██╔══╝
     ██████╔╝██║  ██║██║███████║██║  ██╗██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗
     ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝
................................................................................
  ',
}

class {'::mongodb::globals':
  manage_package_repo => true,
}->

class {'::mongodb::server':
  ensure  => 'present',
  bind_ip => ['0.0.0.0'],
  port    => 27017,
  verbose => true,
  auth    => false,
  # create_admin   => true,
  # admin_username => "admin",
  # admin_password => "admin"
}

mongodb_database { briskhome:
  ensure   => present,
  tries    => 10,
  require  => Class['mongodb::server'],
}

mongodb_user { briskhome:
  name          => 'briskhome',
  ensure        => present,
  password_hash => mongodb_password('briskhome', 'briskhome'),
  database      => 'briskhome',
  roles         => ['readWrite', 'dbAdmin'],
  tries         => 10,
  require       => Class['mongodb::server'],
}


# ::systemd::unit_file { 'briskhome.service':
#  source => "/opt/briskhome/sys/briskhome.service",
# }
