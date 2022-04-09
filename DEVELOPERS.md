# Developer's Guide

## Table of contents

[[_TOC_]]

## How to make a release

### Deciding the release version number

This project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Before making the release, it must be decided if it is a *major*, *minor* or
*patch* release.

If you are making a change that will require an upcoming major or minor version
increment, update the planned version for the next release in parentheses after
the `Unreleased` heading in `CHANGELOG.md`. Remember to also update the diff
link for this heading at the bottom of `CHANGELOG.md`.

### Instructions

#### Creating the release

##### Create and merge a pull request for the new version

1. Create a local branch and name it e.g. `release-of-version-&lt;version&gt;`

   Example: `release-of-version-4.1.1`

1. Edit `package.json` and update the `version` field.

1. Run `npm install`

1. Commit the changes with the commit message "update version to &lt;version&gt;".

1. Edit `CHANGELOG.md`

    Add the new release just below the `[Unreleased]` heading.

    At the bottom of the file, add an entry for the new version. These
    entries are not visible in the rendered page, but are essential
    for the version links to the GitLab commit comparisons to work.

    Example:

    ```diff
    +## [4.1.1]
    +

    ```

    ```diff
    -[Unreleased]: https://github.com/magjac/d3-graphviz/compare/v4.1.0...HEAD
    +[Unreleased]: https://github.com/magjac/d3-graphviz/compare/v4.1.1...HEAD
    +[4.1.1]: https://github.com/magjac/d3-graphviz/compare/v4.1.0...v4.1.1
     [4.1.0]: https://github.com/magjac/d3-graphviz/compare/v4.0.0...v4.1.0
     [4.0.0]: https://github.com/magjac/d3-graphviz/compare/v3.2.0...v4.0.0
     [3.2.0]: https://github.com/magjac/d3-graphviz/compare/v3.1.0...v3.2.0

    ```

1. Commit the changes with the commit message "add version &lt;version&gt; to CHANGELOG.md".

1. Push:

   Example: `release-of-version-4.1.1`

1. Wait until the GitHub action has run for your branch and check that it's green

1. Create a pull request

1. Merge the pull request

##### Tag and make a new release at GitHub

1. Fetch the new `master`

1. Create a new tag.

    Example: `git tag v4.1.1`

1. Push the new tag.

   Example: `git push origin refs/tags/v4.1.1`

1. Visit https://github.com/magjac/d3-graphviz/releases/new

1. Use the **Chose a tag** dropdown to select the new tag.

1. Set the **Release title** to v&lt;version&gt;

    Example: `v4.1.1`

See the [CHANGELOG](https://github.com/magjac/d3-graphviz/blob/master/CHANGELOG.md#410) for details.

1. In the **Describe this release** are, type e.g.:

```
See the [CHANGELOG](https://github.com/magjac/d3-graphviz/blob/master/CHANGELOG.md#411) for details.
```

Be careful the get the mangled version corret. In this exmaple `411` stands for `4.1.1`.

1. Click **Publish the release**.

##### Publish to npm with

1. Clone the repo into clean directory

1. Run `npm install`

1. Run `npm run build`

1. Run `npm publish`

