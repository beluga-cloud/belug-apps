In-cluster web-based application that enables users with a one-time installation to deploy, manage, and upgrade 
applications on a Kubernetes cluster. Belug-apps is based on two project:

- <u>[vcluster](https://www.vcluster.com/)</u>, to isolate all applications from existing TrueCharts
- <u>[kubeapps](https://kubeapps.dev/)</u> for the web-base application. Belug-apps make this project compatible with
`TrueNAS Scale` with some extensions.

**CAUTIONS:**   
**- This application needs an ingress and an SSL certificate to work properly**  
**- It has not been tested in multi-node mode**

_This TrueNAS charts **not** is supplied by TrueCharts nor ixsystems_

---

TrueCharts can only exist due to the incredible effort of their staff.
Please consider making a [donation](https://truecharts.org/docs/about/sponsor) or contributing back to the project 
any way you can!

Also, take a look to these two awesome projects:

- [https://github.com/loft-sh/vcluster](https://github.com/loft-sh/vcluster)
- [https://github.com/vmware-tanzu/kubeapps](https://github.com/vmware-tanzu/kubeapps)
