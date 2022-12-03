<a name="unreleased"></a>
## [Unreleased]


<a name="v0.0.1-rc.2"></a>
## [v0.0.1-rc.2] - 2022-12-03
### Chore
- **renovate:** add a better pre-release management


<a name="v0.0.1-rc.1"></a>
## [v0.0.1-rc.1] - 2022-12-03
### Chore
- update and fix upgrade issues
- configure CHANGELOG generators
- **charts:** add dynamically injected values
- **deps:** update github/codeql-action digest to 62b14cb
- **deps:** update dependency golang to v1.19.3
- **deps:** update dependency node to v18.12.1
- **deps:** lock file maintenance
- **deps:** update actions/setup-go action to v3.4.0
- **deps:** lock file maintenance
- **deps:** update dependency helm to v3.10.2
- **develop:** add JUSTFILE to manage development environment
- **github-actions:** validate 'values.yml' file
- **renovate:** fix Renovate configuration
- **renovate:** add configuration for Kubeapps update
- **tools:** add all required tools for the development environment
- **workflows:** add main release workflow
- **workflows:** add manual release workflow
- **workflows:** add post-merge release workflow
- **workflows:** add ASDF cache to speedup workflows
- **workflows:** use actions to commit release

### Feat
- **charts:** update Kubeapps to latest release
- **charts:** fix several Helm mistakes
- **charts:** add api-proxy configuration on TrueScale values
- **charts:** add NOTES.txt
- **kubernetes:** add Kubernetes manifests for Belug-Apps

### Fix
- **api-proxy:** listen on 0.0.0.0 by default
- **deps:** update module go.uber.org/zap to v1.24.0
- **workflows:** pass github token to push step
- **workflows:** pass secrets to workflow_dispatch
- **workflows:** use bot access token to push on protected branches
- **workflows:** check base_ref instead of head_ref
- **workflows:** use git push directly instead of actions
- **workflows:** fix YAML issue

### Test
- **truenas:** mock TrueNAS API for e2e tests

### Pull Requests
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


<a name="v0.0.0"></a>
## v0.0.0 - 2022-11-22
### Chore
- initialize repository
- add belug-apps assets
- update logo assets
- **ci:** always run security workflows on main
- **ci:** add worflow to check Dockerfiles
- **ci:** add worflow to check React component
- **deps:** update helm release vcluster to v0.12.2
- **deps:** update github/codeql-action digest to 4fddc51
- **deps:** update helm release vcluster to v0.13.0
- **deps:** update github-actions
- **deps:** use vcluster 1.12.1 for the moment
- **deps:** add renovate.json
- **deps:** update github-actions
- **deps:** use .renovaterc instead of renovate.json
- **deps:** update actions/checkout action to v3
- **deps:** update github/codeql-action digest to def4f60
- **github-actions:** tag all version
- **nodejs:** clean dependencies and add build script
- **react:** add linter
- **renovate:** schedule digest update at the end of each month
- **renovate:** group all github action updates
- **yamllint:** reduce warn on YAML comments
- **yamllint:** disable line-lenght checks

### Doc
- **api-proxy:** update proxy documentation

### Feat
- add beta belug-apps charts
- **api-proxy:** add README.md to explain the proxy-api
- **api-proxy:** add healthcheck route
- **api-proxy:** move all truenas API call to dedicated route
- **api-proxy:** add hit mecanism to keep the cache when it used
- **api-proxy:** implement a simple reverse proxy for TrueNAS
- **api-proxy:** add Docker image
- **belug-apps:** add missing chart archive
- **ci:** add Helm security check
- **ci:** add YAML lint
- **ci:** add CI security checks
- **github-actions:** add workflows related to Golang
- **react:** implement hostpath component
- **react:** first implementation of Kubeapps custom component

### Fix
- **deps:** update module github.com/hashicorp/golang-lru/v2 to v2.0.1
- **deps:** update module github.com/hashicorp/golang-lru to v2
- **deps:** update module github.com/hashicorp/golang-lru to v0.6.0
- **deps:** update module github.com/urfave/cli/v2 to v2.23.5
- **deps:** update module github.com/urfave/cli/v2 to v2.23.0
- **react:** fix all linter issues

### Hotfix
- **deps:** fix .renovaterc

### Refact
- fix some security issues
- clean YAML issues
- **proxy-api:** extract CLIAction parth to another file
- **proxy-api:** move proxy-api to src/ directory
- **proxy-api:** move all middlewares to their dedicated method
- **react:** add better selection and error management
- **react:** adapt component for new Kubeapps UI
- **react:** use functional component
- **react:** simplify as much as possible all components

### Test
- **proxy-api:** add e2e test for the proxy API

### Pull Requests
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


[Unreleased]: https://github.com/belug-apps/belug-apps/compare/v0.0.1-rc.2...HEAD
[v0.0.1-rc.2]: https://github.com/belug-apps/belug-apps/compare/v0.0.1-rc.1...v0.0.1-rc.2
[v0.0.1-rc.1]: https://github.com/belug-apps/belug-apps/compare/v0.0.0...v0.0.1-rc.1
