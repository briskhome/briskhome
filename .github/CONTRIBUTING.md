First off, let me thank you for your interest in contributing to this project! **BRISKHOME** is free open-source software and I strongly believe that together we can create a better experience for developers and users alike.

Here are several ways you can get involved:

1. **Coding**. If you speak fluent JavaScript and are not afraid of words _Babel_, _Flow_ and _Webpack_ then bravely step onboard! Take a look at currently open issues and pick something you fancy.
2. **Documenting**. If you don't want to code new features but still want to be a part of the team we invite you to try documenting the application. We have a separate repository dedicated to documentation, feel free to jump onboard!
3. **Envisioning**. One word – **suggest**! From a one-sentence issue to a complitated tech story – every piece helps. Your ideas help us create our dreams.

### Workflow

We impose several restrictions that are aimed at keeping our code base nice and clean. First, `master` branch is protected – meaning that it cannot be pushed to directly and its history will never be rewritten. You can rely on it in your workflow.

### Coding

When you have chosen the issue you want to jump on and forked the project we suggest you immediately open a new pull request. It will let us know that you're working the issue and will automatically run status checks for your code.

Do not be afraid to rewrite history of your branch. In fact, merge commits are prohibited in this repository – please use `git rebase` to bring your branch up to date. It you ever need help rebasing feel free to mention the `@briskhome/core` team in a comment asking for help!

### Status checks

Every time you push new commits to your branch (provided you've opened a pull request) they will automatically be checked by several code quality tools. This includes linting your code, testing it and calculating code coverage. Some of the checks are required — your pull request could not be merged unless they pass.

### Merging

When you will have finished implementing your awesome feature and all status checks pass, request a review from `@briskhome/core` team by mentioning them in a comment. Note that we may ask you to rebase it onto `master` branch – this is our preferred way of bringing branches up to date.
