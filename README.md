# BRISKHOME
[![Travis](https://img.shields.io/travis/heuels/briskhome.svg?style=flat-square)](https://travis-ci.org/heuels/briskhome) [![GitHub release](https://img.shields.io/github/release/heuels/briskhome.svg?style=flat-square)](https://github.com/heuels/briskhome/releases/latest) [![Test Coverage](https://img.shields.io/codeclimate/coverage/github/heuels/briskhome.svg?style=flat-square)](https://codeclimate.com/github/heuels/briskhome/coverage) [![Code Climate](https://img.shields.io/codeclimate/github/heuels/briskhome.svg?style=flat-square)](https://codeclimate.com/github/heuels/briskhome) [![GitHub issues](https://img.shields.io/github/issues/heuels/briskhome.svg?style=flat-square)](https://github.com/heuels/briskhome/issues)

**BRISK**HOME is a work-in-progress **open-source house monitoring and automation system** for Node.js.

## Installation
### Prerequisites
Prior to installing this application please make sure that your system is properly set up and does meet the requirements listed in **[System Administrator Guide]()**.

### Automatic installation
**BRISK**HOME is currently not published on **npm**. You can install it via the command line with either `curl` or `wget` which will run this [installation script]().

#### via `curl`
```shell
su -c "curl -o /tmp/install.sh https://.../install.sh && chmod +x /tmp/install.sh && /tmp/install.sh"
```

#### via `wget`
```shell
su -c "wget -O /tmp/install.sh https://.../install.sh && chmod +x /tmp/install.sh && /tmp/install.sh"
```

### Manual installation
If you would like to manually install the application, please follow the instructions in the [installation script]().

## Configuration

Please see the [corresponding section in the]() **[Administrator Guide]()** for configuration instructions.

## Documentation
Documentation for the application is available **[online at ReadTheDocs]()** and consists of three separate documents that are intended for different auditories:
* **[Administrator Guide]()** — this document is aimed at helping local system administrators set up and prepare the system to the installation of **BRISK**HOME.
* **[Developer Guide]()** — this document describes the application's core and REST API and is intended for developers who want to to add functionality to **BRISK**HOME.
* **[User Manual]()** — this document contains usage instructions for end-users.

## Contributing
**BRISK**HOME welcomes contributions! There are several ways you can get involved.

* **Coding**. Take a look at a **[next release roadmap]()** and feel free to jump on any tasks you like. When submitting pull requests please **make sure that all new code is unit-tested and linted**.
* **Documenting**. You can help writing documentation for the latest release in either **[English]()** or **[Russian]()** language.
* **Reporting bugs**. If you have encountered a bug or an unexpected behavior, please **[open an issue]()**. Note that bugs in external components should be reported and tracked in their corresponding repositories.
* **Suggesting features**. You can always suggest a new feature by **[opening an issue]()**.

## License
The MIT License (MIT)

Copyright (c) 2015-2017 Egor Zaitsev

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
