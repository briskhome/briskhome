# Briskhome
[![Travis](https://img.shields.io/travis/heuels/briskhome.svg?style=flat-square)](https://travis-ci.org/heuels/briskhome) [![GitHub release](https://img.shields.io/github/release/heuels/briskhome.svg?style=flat-square)](https://github.com/heuels/briskhome/releases/latest) [![Test Coverage](https://img.shields.io/codeclimate/coverage/github/heuels/briskhome.svg?style=flat-square)](https://codeclimate.com/github/heuels/briskhome/coverage) [![Code Climate](https://img.shields.io/codeclimate/github/heuels/briskhome.svg?style=flat-square)](https://codeclimate.com/github/heuels/briskhome) [![GitHub issues](https://img.shields.io/github/issues/heuels/briskhome.svg?style=flat-square)](https://github.com/heuels/briskhome/issues) [![Documentation](https://readthedocs.org/projects/briskhome/badge/?version=latest&style=flat-square)](http://briskhome.readthedocs.io/en/latest/?badge=latest)

**Briskhome** is a work-in-progress **open-source house monitoring and automation system** for Node.js.

> **Notice – Please Read**  
> This application currently does not work out of-the-box and requires a lot of time and effort to set up and run. If you're looking for a complete *smart home* solution then you've come to the wrong place – please check back in a year or so.


## Installation
### Prerequisites
Prior to installing this application please make sure that your system is properly set up, has required system packages installed and does meet the minimum requirements listed in the **[Administrator Guide](http://briskhome.readthedocs.io/en/latest/admin/index.html)**.

### Automatic installation
**Briskhome** is currently not published on **npm**. You can install it via the command line with either `curl` or `wget`.

#### via `curl`
```shell
su -c "curl -o /tmp/install.sh https://raw.githubusercontent.com/heuels/briskhome/master/scripts/install.sh && chmod +x /tmp/install.sh && /tmp/install.sh"
```

#### via `wget`
```shell
su -c "wget -O /tmp/install.sh https://raw.githubusercontent.com/heuels/briskhome/master/scripts/install.sh && chmod +x /tmp/install.sh && /tmp/install.sh"
```

### Manual installation
If you would like to manually install the application, please follow the instructions in the [installation script](https://raw.githubusercontent.com/heuels/briskhome/master/scripts/install.sh).

## Configuration

Please see the [corresponding section in the](http://briskhome.readthedocs.io/en/latest/admin/installing-briskhome.html) **[Administrator Guide](http://briskhome.readthedocs.io/en/latest/admin/index.html)** for configuration instructions.

## Documentation
Documentation for the application is available **[online at ReadTheDocs](http://briskhome.readthedocs.io/)** and consists of three separate documents that are intended for different auditories:
* **[Administrator Guide](http://briskhome.readthedocs.io/en/latest/admin/index.html)**. This document is aimed at helping local system administrators prepare and set up the system for the installation of **Briskhome**.
* **[Developer Guide](http://briskhome.readthedocs.io/en/latest/developer/index.html)**. This document describes the application's core and REST API and is intended for developers who want to to add functionality to **Briskhome**.
* **[User Manual](http://briskhome.readthedocs.io/en/latest/manual/index.html)**. This document contains usage instructions for end-users.

## Contributing
**Briskhome** welcomes contributions! There are several ways you can get involved.

* **Developing**. Take a look at the **[current release roadmap](https://github.com/heuels/briskhome/projects/1)** or **[next release roadmap](https://github.com/heuels/briskhome/projects/2)** and feel free to jump on any tasks you like. Prior to submitting pull requests please make sure that all new code is **unit-tested and linted**.
* **Documenting**. You can help **[writing documentation](https://github.com/heuels/briskhome-docs)** for the latest release or work-in-progress features.
* **Reporting bugs**. If you have encountered a bug or an unexpected behavior, please **[open an issue](https://github.com/heuels/briskhome/issues/new)**.
* **Suggesting features**. You can always suggest a new feature by **[opening an issue](https://github.com/heuels/briskhome/issues/new)**.

If you like the project do [contact me](mailto:ezaitsev@briskhomoe.com) – I'd love to work on it together!

## License
The MIT License (MIT)

Copyright (c) 2015-2017 Egor Zaitsev

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
