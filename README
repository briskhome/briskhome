![Briskhome](logo3.png)

Node.js house automation and monitoring project with `Architect.js` as a module backend.
[User manual](docs/.build/html/index.html) and administration guide are available as a part of this repository.

### Core modules
Currently there are 5 core modules are modules:
#### `core.bus`
Unified event bus. Should be used by any plugins that send or receive events throughout the system.

**Usage**
```js
const bus = imports.bus;
bus.emit(message);
```

#### `core.config`
Configuration loader. Manages configuration of system, core and extension modules depending on current environment.
*TODO: *
**Usage**
```js
// briskhome.conf => { test: value }
const config = imports.config;
console.log(config.test); // value
```

#### `core.db`
. . .
#### `core.log`
. . .
#### `core.pki`
. . .

### Extension modules
Extension modules provide additional functionality

#### `irrigation`
* **Controller** - an Arduino device that controls the solenoids of the valves, measures temperature and answers to the irrigation master.
* **Master** - a **BRISK**HOME instance with irrigation extension module installed and running in master mode. Communicates directly with controller.
* **Slave** - a **BRISK**HOME instance with irrigation extension module installed and  running in slave mode. Communicates with controller via the master.

#### `onewire`
. . .

#### `sysinfo`
. . .
#### `playground`
A special extension module that is used for prototyping and testing out how different modules work out together. Consumes all installed and available modules.

### Folders

**api**
**etc**
**lib**
**log**
**node_modules**
**scripts***
