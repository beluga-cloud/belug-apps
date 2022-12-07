<!-- markdownlint-disable MD033 -->
<h1 align="center">
  <a href="https://github.com/belug-apps">
    <img src="assets/logo_400px.png" alt="Logo" width="150" height="150">
  </a>
</h1>

<h4 align="center">Belug-Apps - TrueCharts alternative for TrueNAS SCALE</h4>

<div align="center">
  <a href="https://github.com/belug-apps/belug-apps/issues/new?https://github.com/xunleii/belug-apps-test/issues/new?assignees=&labels=type%3A+bug%2Cstate%3A+needs+triage&template=01_BUG_REPORT.yml&title=%F0%9F%90%9B+&version=v0.3.0">Report a Bug</a> ·
  <a href="https://github.com/belug-apps/belug-apps-test/issues/new?assignees=&labels=type%3A+enhancement&template=02_FEATURE_REQUEST.yml&title=%E2%9C%A8+">Request a Feature</a> ·
  <a href="https://github.com/belug-apps/belug-apps/discussions">Ask a Question</a>
  <br/>
  <br/>

  [
    ![Last stable release](https://img.shields.io/github/v/release/belug-apps/belug-apps?label=stable&logo=gitlfs&logoColor=white&logoWidth=20&sort=semver)
  ](https://github.com/belug-apps/belug-apps/releases)
  [
    ![Last tags (pre-release)](https://img.shields.io/github/v/tag/belug-apps/belug-apps?include_prereleases&label=pre-release&logo=gitlfs&logoColor=white&logoWidth=20&sort=semver)
  ](https://github.com/belug-apps/belug-apps/tags)
  [
    ![License](https://img.shields.io/github/license/belug-apps/belug-apps?logo=git&logoColor=white&logoWidth=20)
  ](LICENSE)
  <br/>
  ![TrueNAS Scale compatible version](https://img.shields.io/badge/TrueNAS_compatibility-SCALE%2022.02-success?logo=truenas&logoColor=white&logoWidth=20)
  [
    ![Pending dependencies](https://img.shields.io/github/issues/belug-apps/belug-apps/dependencies?label=dependencies&logo=renovatebot&logoWidth=20&style=flat)
  ](https://github.com/belug-apps/belug-apps/pulls?q=is%3Aopen+is%3Apr+label%3Adependencies)
  <br/>

  <a href="#about">About</a> ·
  <a href="#install">How to Install?</a> ·
  <a href="#update">How to Update?</a> ·
  <a href="#support">Support</a> ·
  <a href="#contributing">Contributing</a> ·
  <a href="#security">Security</a> ·
  <a href="#license">License</a> ·
  <a href="#acknowledgements">Acknowledgements</a>

</div>

---
<!-- markdownlint-enable MD033 -->

## About

TrueNAS is an excellent operating system for NAS management and has had a Kubernetes cluster built
in since the early versions of SCALE. To manage the "applications" deployed on it, you have to go
through the TrueCharts project - which is actually a very good initiative, in the continuity of
[k8s-at-home](https://k8s-at-home.com/).

However, as far as I know, only TrueNAS SCALE has an user interface to install these Helm charts
and I find their way to manage them too complex (too deep in the DRY mindset).  
With this in mind, Belug-Apps was born: to provide an alternative to TrueCharts, running on the
TrueNAS SCALE Kubernetes cluster and based on a user interface that can be used on any other
Kubernetes cluster *(which makes migrations more easier)*.

- Provides a dashboard to **see and manage your applications** (based on Helm charts) - *thanks to <https://kubeapps.dev/>*
- **Isolate all your configurations and workloads** into a virtual cluster - *thanks to <https://www.vcluster.com/>*
- **Install any Helm chart** you want, from any Helm repository on your TrueNAS SCALE instance

## Getting Started

### Prerequisites

Although Belug-Apps was designed to be as agnostic as possible, it still requires some things:

- An input controller must be installed. I recommend using Traefik because I haven't tested any
others and the installation form was designed for it *(like the other TrueCharts applications)*.
- A dedicated DNS entry to access the dashboard.
- A valid SSL certificate. *It can probably work without one, but I recommend it for security reasons.*

### Install

The only way to install Belug-Apps is to use the TrueNAS Apps interface. TrueNAS provides excellent
documentation on [how to add a catalog](https://www.truenas.com/docs/scale/scaletutorials/apps/usingcatalogs/#adding-catalogs), 
but here is a TLDR:

- Go to your TrueNAS instance and open the **Apps** page.
- Click on the **Add Catalog** button at the top right of the **Manage Catalogs** tab.
- Fill in the **Add Catalog** form with the following values:
  - Catalog Name: `belug-apps`
  - Repository: `https://github.com/belug-apps/truecharts-catalog`
  - Preferred Trains: keep `stable` *(but if you want to try release-candidates, you can use `incubator`)*
  - Branch: keep `main`

Wait until the catalog is synchronized. Congratulations, you can now install Belug-Apps in the
**Available Applications** tab.

Finally, when Belug-Apps is installed, you can open the dashboard by clicking on *Open* on the
application card.

### Update

As with other TrueNAS SCALE applications, when a **new version** is out, you will receive an
update notification. You will be able to update it directly from the **Apps** page.

## Support

Reach out to the maintainer at one of the following places:

- [GitHub Discussions](https://github.com/belug-apps/belug-apps/discussions)
- Open an issue on [Github](https://github.com/belug-apps/belug-apps/issues/new?assignees=&labels=bug&template=01_BUG_REPORT.md&title=bug%3A+)

## Contributing

First off, thanks for taking the time to contribute! Contributions are what make the
open-source community such an amazing place to learn, inspire, and create. Any contributions 
you make will benefit everybody else and are **greatly appreciated**.

Please read [our contribution guidelines](docs/CONTRIBUTING.md), and thank you for being involved!

## Security

Belug-Apps follows good practices of security, but 100% security cannot be assured.
Belug-Apps is provided **"as is"** without any **warranty**. Use at your own risk.

*For more information and to report security issues, please refer to our [security documentation](docs/SECURITY.md).*

## License

This project is licensed under the **Apache Software License 2.0**.

See [LICENSE](LICENSE) for more information.

## Acknowledgements

Thanks for these awesome resources and project that were used during the development of **Belug-Apps**:

- <https://github.com/dec0dOS/amazing-github-template> - awesome resources for configuring this project, in particular this `README.md`
- <https://kubeapps.dev/> - dashboard used by **Belug-Apps** to manage your Helm releases
- <https://truecharts.org/> - for they works to make Kubernetes easy to use on TrueNAS SCALE
- <https://www.vcluster.com/> - used to work with TrueCharts without side effects *(Kubernetes isolation)*
