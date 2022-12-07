<a name="unreleased"></a>
## [Unreleased]



<a name="v0.5.0-rc.4"></a>
## [v0.5.0-rc.4] - 2022-12-07
### Fixes
- **workflows:** use `git tag --sort` to sort tags
- **chart:** .Chart.Version should not be used with vcluster templating

### Miscellaneous
- **CHANGELOG:** ignore pre-release on changelog
- **chart:** allow to commit dependecies
- **release:** rebuild Helm dependencies every releases
- **workflows:** add debug logs on workflows
- **release:** group all changes required for release inside the .justfile
- **workflows:** remove useless validation

### Pull Requests
- Merge pull request [#66](https://github.com/belug-apps/belug-apps/issues/66) from belug-apps/fix/api-proxy-helm-version


<a name="v0.4.0"></a>
## [v0.4.0] - 2022-12-07
### Fixes
- fix bump version mechanism
- **workflows:** sync belug-apps/truechart-catalog instead of current one


<a name="v0.3.0"></a>
## [v0.3.0] - 2022-12-07
### Dependencies
- **deps:** Update dependency golang to v1.19.4
- **deps:** Update asdf-vm/actions digest to 707e84f

### Fixes
- add OR logical instead of allowing error
- **deps:** Update module github.com/urfave/cli/v2 to v2.23.6
- **workflows:** allow failure on conditional step
- fix YAML lint issues on git-chglog config

### Miscellaneous
- add README.md
- move some documentation to docs/
- **workflows:** manage labels through Github Actions
- **workflows:** update release message using gitmoji
- **github:** add issues & PRs templates
- **changelog:** update git-chglog to manage gitmoji commit message
- **deps:** use gitmoji with Renovate

### Pull Requests
- Merge pull request [#59](https://github.com/belug-apps/belug-apps/issues/59) from belug-apps/renovate/asdf
- Merge pull request [#57](https://github.com/belug-apps/belug-apps/issues/57) from belug-apps/chore/prepare-repo-for-public-usage
- Merge pull request [#54](https://github.com/belug-apps/belug-apps/issues/54) from belug-apps/renovate/asdf-vm-actions-digest
- Merge pull request [#56](https://github.com/belug-apps/belug-apps/issues/56) from belug-apps/renovate/github.com-urfave-cli-v2-2.x
- Merge pull request [#53](https://github.com/belug-apps/belug-apps/issues/53) from belug-apps/chore/update-release-message


<a name="v0.1.1"></a>
## [v0.1.1] - 2022-12-03
### Fixes
- **workflows:** allow softprops/action-gh-release to fail


<a name="v0.1.0"></a>
## [v0.1.0] - 2022-12-03
### Dependencies
- **deps:** lock file maintenance
- **deps:** lock file maintenance
- **deps:** update dependency golang to v1.19.3
- **deps:** update dependency node to v18.12.1
- **deps:** update actions/setup-go action to v3.4.0
- **deps:** update dependency helm to v3.10.2
- **deps:** update github/codeql-action digest to 62b14cb
- **deps:** update module go.uber.org/zap to v1.24.0
- **deps:** update Kubeapps to latest release
- **deps:** update github/codeql-action digest to def4f60
- **deps:** update module github.com/hashicorp/golang-lru/v2 to v2.0.1
- **deps:** update module github.com/hashicorp/golang-lru to v2
- **deps:** update module github.com/hashicorp/golang-lru to v0.6.0
- **deps:** update module github.com/urfave/cli/v2 to v2.23.5
- **deps:** update github/codeql-action digest to 4fddc51
- **deps:** update helm release vcluster to v0.13.0
- **deps:** update github-actions
- **deps:** use vcluster 1.12.1 for the moment
- **deps:** update module github.com/urfave/cli/v2 to v2.23.0
- **deps:** update actions/checkout action to v3
- **deps:** update github-actions
- **deps:** update helm release vcluster to v0.12.2

### Fixes
- **deps:** fix .renovaterc
- **kubeapps-component:** fix all linter issues
- **workflows:** fix some linter issues
- **workflows:** tag all versions
- **yamllint:** reduce warn on YAML comments
- **yamllint:** disable line-lenght checks
- update and fix upgrade issues
- **workflows:** fix YAML issue
- **workflows:** pass github token to push step
- **workflows:** pass secrets to workflow_dispatch
- **workflows:** use bot access token to push on protected branches
- **workflows:** check base_ref instead of head_ref
- **workflows:** use git push directly instead of actions
- **api-proxy:** listen on 0.0.0.0 by default
- **charts:** fix several Helm mistakes
- **deps:** fix Renovate configuration

### Improvements
- **proxy-api:** extract CLI.Action part to another file
- **api-proxy:** move all truenas API call to dedicated route
- **kubeapps-component:** use functional component
- **proxy-api:** move proxy-api to src/ directory
- **kubeapps-component:** adapt component for new Kubeapps UI
- clean YAML issues
- **kubeapps-component:** simplify as much as possible all components
- **proxy-api:** move all middlewares to their dedicated method

### Miscellaneous
- **kubeapps-component:** add linter
- **workflows:** cache ASDF
- **workflows:** add a better pre-release management
- **workflows:** use actions to commit release
- **workflows:** add ASDF cache to speedup workflows
- **workflows:** add post-merge release workflow
- **workflows:** add manual release workflow
- **workflows:** add main release workflow
- **workflows:** validate 'values.yml' file
- **workflows:** always run security workflows on main
- **workflows:** add worflow to check Dockerfiles
- **workflows:** manage release on tags
- **workflows:** add worflow to check React component
- **workflows:** add workflows related to Golang
- **workflows:** add Helm security check
- **workflows:** add YAML lint
- **workflows:** add workflows for security checks
- **api-proxy:** add healthcheck route
- **deps:** add configuration for Kubeapps update
- **deps:** schedule digest update at the end of each month
- **deps:** group all github action updates
- **deps:** use .renovaterc instead of renovate.json
- **deps:** add renovate.json
- **tools:** add all required tools for the development environment
- **api-proxy:** mock TrueNAS API for e2e tests
- **kubeapps-component:** add better selection and error management
- **api-proxy:** update proxy documentation
- **api-proxy:** add README.md to explain the proxy-api
- **charts:** add NOTES.txt
- update logo assets
- add belug-apps assets
- **proxy-api:** add e2e test for the proxy API
- configure CHANGELOG generators
- add JUSTFILE to manage development environment
- **charts:** add dynamically injected values
- **kubeapps-component:** clean dependencies and add build script
- **vcluster:** add missing chart archive

### New Features
- **api-proxy:** add hit mecanism to keep the cache when it used
- **api-proxy:** implement a simple reverse proxy for TrueNAS
- **charts:** add api-proxy configuration on TrueScale values
- **kubeapps-component:** implement hostpath component

### Security
- fix some security issues

### Pull Requests
- Merge pull request [#46](https://github.com/belug-apps/belug-apps/issues/46) from belug-apps/chore/add-release-by-tag-workflow
- Merge pull request [#45](https://github.com/belug-apps/belug-apps/issues/45) from belug-apps/fix/post-merge-workflow
- Merge pull request [#44](https://github.com/belug-apps/belug-apps/issues/44) from belug-apps/fix/post-merge-workflow
- Merge pull request [#43](https://github.com/belug-apps/belug-apps/issues/43) from belug-apps/fix/post-merge-workflow
- Merge pull request [#42](https://github.com/belug-apps/belug-apps/issues/42) from belug-apps/fix/post-merge-workflow
- Merge pull request [#41](https://github.com/belug-apps/belug-apps/issues/41) from belug-apps/feat/release-workflows
- Merge pull request [#40](https://github.com/belug-apps/belug-apps/issues/40) from belug-apps/renovate/lock-file-maintenance
- Merge pull request [#30](https://github.com/belug-apps/belug-apps/issues/30) from belug-apps/renovate/lock-file-maintenance
- Merge pull request [#37](https://github.com/belug-apps/belug-apps/issues/37) from belug-apps/renovate/golang-1.x
- Merge pull request [#38](https://github.com/belug-apps/belug-apps/issues/38) from belug-apps/renovate/helm-3.x
- Merge pull request [#36](https://github.com/belug-apps/belug-apps/issues/36) from belug-apps/renovate/github-actions
- Merge pull request [#39](https://github.com/belug-apps/belug-apps/issues/39) from belug-apps/renovate/node-18.x
- Merge pull request [#35](https://github.com/belug-apps/belug-apps/issues/35) from belug-apps/renovate/github-codeql-action-digest
- Merge pull request [#34](https://github.com/belug-apps/belug-apps/issues/34) from belug-apps/renovate/go.uber.org-zap-1.x
- Merge pull request [#33](https://github.com/belug-apps/belug-apps/issues/33) from belug-apps/feat/environment-to-develop
- Merge pull request [#29](https://github.com/belug-apps/belug-apps/issues/29) from belug-apps/renovate/github-codeql-action-digest
- Merge pull request [#31](https://github.com/belug-apps/belug-apps/issues/31) from belug-apps/feat/add-proxy-image
- Merge pull request [#27](https://github.com/belug-apps/belug-apps/issues/27) from belug-apps/refact/use-functional-component
- Merge pull request [#26](https://github.com/belug-apps/belug-apps/issues/26) from belug-apps/renovate/github.com-hashicorp-golang-lru-v2-2.x
- Merge pull request [#25](https://github.com/belug-apps/belug-apps/issues/25) from belug-apps/renovate/github.com-hashicorp-golang-lru-2.x
- Merge pull request [#24](https://github.com/belug-apps/belug-apps/issues/24) from belug-apps/feat/change-proxy-api-rootpath
- Merge pull request [#22](https://github.com/belug-apps/belug-apps/issues/22) from belug-apps/feat/add-kubeapps-custom-component
- Merge pull request [#19](https://github.com/belug-apps/belug-apps/issues/19) from belug-apps/renovate/github.com-hashicorp-golang-lru-0.x
- Merge pull request [#16](https://github.com/belug-apps/belug-apps/issues/16) from belug-apps/renovate/vcluster-0.x
- Merge pull request [#17](https://github.com/belug-apps/belug-apps/issues/17) from belug-apps/renovate/github.com-urfave-cli-v2-2.x
- Merge pull request [#21](https://github.com/belug-apps/belug-apps/issues/21) from belug-apps/renovate/github-actions
- Merge pull request [#18](https://github.com/belug-apps/belug-apps/issues/18) from belug-apps/renovate/github-actions
- Merge pull request [#13](https://github.com/belug-apps/belug-apps/issues/13) from belug-apps/renovate/github.com-urfave-cli-v2-2.x
- Merge pull request [#14](https://github.com/belug-apps/belug-apps/issues/14) from belug-apps/renovate/actions-checkout-3.x
- Merge pull request [#11](https://github.com/belug-apps/belug-apps/issues/11) from belug-apps/renovate/github-actions
- Merge pull request [#12](https://github.com/belug-apps/belug-apps/issues/12) from belug-apps/renovate/vcluster-0.x
- Merge pull request [#8](https://github.com/belug-apps/belug-apps/issues/8) from belug-apps/chore/group-github-action-dependencies
- Merge pull request [#3](https://github.com/belug-apps/belug-apps/issues/3) from belug-apps/feature/add-reverse-proxy-api
- Merge pull request [#2](https://github.com/belug-apps/belug-apps/issues/2) from belug-apps/renovate/configure
- Merge pull request [#1](https://github.com/belug-apps/belug-apps/issues/1) from belug-apps/feat/add-github-actions


<a name="v0.0.0"></a>
## v0.0.0 - 2022-10-22

[Unreleased]: https://github.com/belug-apps/belug-apps/compare/v0.5.0-rc.4...HEAD
[v0.5.0-rc.4]: https://github.com/belug-apps/belug-apps/compare/v0.4.0...v0.5.0-rc.4
[v0.4.0]: https://github.com/belug-apps/belug-apps/compare/v0.3.0...v0.4.0
[v0.3.0]: https://github.com/belug-apps/belug-apps/compare/v0.1.1...v0.3.0
[v0.1.1]: https://github.com/belug-apps/belug-apps/compare/v0.1.0...v0.1.1
[v0.1.0]: https://github.com/belug-apps/belug-apps/compare/v0.0.0...v0.1.0
