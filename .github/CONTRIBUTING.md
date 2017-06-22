First off, let me thank you for your interest in contributing to this project! **Briskhome** is free open-source software and I strongly believe that together we can create a better experience for developers and users alike.

Here are several ways you can get involved:
1. **Coding**. If you speak fluent JavaScript and are not afraid of words *flow*, *babel*, *dataloader* and *jest* then bravely step onboard! Take a look at currently open issues and pick something you fancy.
2. **Documenting**. If you don't want to code new features but still want to be a part of the team we invite you to try documenting the application. We have a separate repository dedicated to documentation, feel free to jump onboard!
3. **Envisioning**. One word – **suggest**! From a one-sentence issue to a complitated tech story – every piece helps. Your ideas help us create our dreams.


### Setup and workflow
We impose several restrictions that are aimed at keeping our code base nice and clean. First, `master` and `develop` branches are protected. It means that only they cannot be pushed to directly and their history cannot be rewritten. You can rely on them in your workflow.
* `master` branch always contains a stable tagged version of the package that ready for deploying. For your convenience up-to-date `deb` and `rpm` packages are available from **[releases](https://github.com/briskhome/briskhome/releases)** page.
* `develop` branch contains more-or-less stable code that is usually ahead of `master`. Pull requests should be opened against `develop`.

#### Coding.
When you have chosen the issue you want to jump on you need to fork the project, create a new branch and immediately open a pull-request. Why? To let us know that you are working on this issue and to make use of our awesome status checks.  
> **Naming conventions**: Prefix you pull request title with a number of the issue it resolves in square brackets. Then include a one-sentence description of what it does. It's that simple! Here are some examples:  
> - `[#51] Add CONTRIBUTING.markdown`  
> - `[#62] Fix colons in 'getCallee()' output`  

By the way, do not be afraid to rewrite history of your branch. In fact, we even prefer rebasing to other means of bringing the branch up to date and making commits more senseful.

#### Status checks.
Every time you push new commits to your pull request they are automatically checked by several code quality tools. This includes linting your code, testing it and calculating code coverage. We also collect code quality information with CodeClimate, but this is purely informational – you choose whether to listen to it or not. But all other status checks are required and must pass in order for pull request to be merged.  

#### Merging.
When you will have finished implementing your awesome feature and all status checks pass you need to request a review from any **Briskhome** team member. You can ping @briskhome/core in your PR or just assign someone directly. Note that we may ask you to rebase it onto `develop` branch – this is our preferred way of bringing branches up to date.

#### Pull requests
Pull requests are the only way to get code into `develop` branch and then to `master`. Each pull request has to be approved by a @briskhome/core team member in order to be merged. If after you began implementing your feature someone managed to slip a new commit into `develop` you would need to rebase your branch onto the updated `develop` branch.  
If you ever need help with rebasing and/or your pull request feel free to mention us in your pull request – we would be happy to help!
