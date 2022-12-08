set export

# default values
default_cluster_name := "belug-apps"
default_registry := "ocr.local/belug-apps"

# show this page
default:
    @just --list

# build Belug-Apps helm charts with external manifests and Kubeapps component
[no-exit-message]
build environment="production":
    cd 'src/kubeapps-components' && (yarn; yarn build --mode={{environment}})
    @just _utils_chart_inject_components
    @just _utils_chart_inject_manifests {{ if environment =~ 'prod.*' { "default" } else { "dev" } }}

# made all changes required to release Belug-Apps
[no-exit-message]
release version: build
    # update version inside Chart.yml and values.yml
    sed --regexp-extended --in-place 's/^((app)?[vV]ersion).+/\1: {{version}}/g' charts/belug-apps/Chart.yaml
    sed --regexp-extended --in-place  's/^(    version):.+$/\1: {{version}}/g' charts/belug-apps/values.yaml

    # update chart dependencies
    cd 'charts/belug-apps' && helm dependencies update

    # update CHANGELOG.md
    git-chglog --next-tag v{{version}} > CHANGELOG.md

    # update README.md (ignore pre-release)
    {{ if version =~ '^[0-9]+\.[0-9]+\.[0-9]+$' { "sed --regexp-extended --in-place 's/version=[^\"]+/version=v" + version + "/g' README.md" } else { "# ignore on pre-release" } }}


###############################################################################
# [develop] - manage the lifecycle of the development environment

# start the environment to develop and test Belug-Apps
[no-exit-message]
develop_up context=(default_cluster_name + "-dev"): (_env_up context "development")

# stop the current development environment and clean everything
[no-exit-message]
develop_down context=(default_cluster_name + "-dev"): (_env_down context)

# (re)deploy everything on the development cluster
[no-exit-message]
develop_refresh context=(default_cluster_name + "-dev"): (_env_install context "development")
alias develop := develop_refresh

# get Kubeapps (Belug-Apps dashboard) URL of the current development environment
[no-exit-message]
develop_dashboard_url context=(default_cluster_name + "-dev"): (_env_dashboard_url context)

# open Kubeapps (Belug-Apps dashboard) of the current development environment with your favorite browser
[no-exit-message]
[linux]
develop_open_dashboard context=(default_cluster_name + "-dev"): (_env_open_dashboard context)


###############################################################################
# [env] - internal commands to manage local Belug-Apps environment

# [private] start a Kubernetes cluster with Belug-Apps
# NOTE: this will 
#   - create a KIND cluster
#   - install nginx as ingress controller
#   - deploy Belug-Apps on the KIND cluster
[no-exit-message]
_env_up context environment: (_kind_create_cluster context)
    kubectl --context kind-{{context}} apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/kind/deploy.yaml
    @just _env_install {{context}} {{environment}}
    @just _success "your environment {{context}} is ready to use"

# [private] stop the Kubernetes cluster hosting Belug-Apps
[no-exit-message]
_env_down context: (_kind_delete_cluster context) 
    @just _success "your environment {{context}} has been successfully cleaned"

# [private] install or refresh Belug-Apps on the kubernetes cluster
[no-exit-message]
_env_install context environment="production": (_assert_kind_cluster_exists context) (_env_install_images context) (_env_install_belugapps context environment)

# [private] install or refresh images on the kubernetes cluster
[no-exit-message]
_env_install_images context:
    @just _utils_prepare_image {{default_registry / "truenas-api:dev"}} "test/mocks/truenas-api/" {{context}}
    @just _utils_prepare_image {{default_registry / "api-proxy:dev"}} "src/api-proxy/" {{context}}

# [private] install or refresh Belug-Apps deployment
[no-exit-message]
_env_install_belugapps context environment="production": (build environment)
    helm upgrade --install --atomic --kube-context "kind-{{context}}" belug-apps charts/belug-apps \
        --namespace ix-belug-apps --create-namespace \
        --values ./test/e2e/helm.values.yaml \
        --set vcluster.ix_portal.main.host="kubeapps.$(just _get_kind_cluster_address {{context}}).nip.io"

# [private] get Kubeapps (Belug-Apps dashboard) URL of the current development environment
[no-exit-message]
@_env_dashboard_url context: (_assert_kind_cluster_exists context)
    kubectl --context "kind-{{context}}" --namespace ix-belug-apps \
        get configmap portal \
        --output jsonpath='http://{.data.host}{.data.path}'

# [private] open Kubeapps (Belug-Apps dashboard) of the current development environment with your favorite browser
[no-exit-message]
[linux]
@_env_open_dashboard context: (_assert_kind_cluster_exists context)
    xdg-open "$(just develop_dashboard_url {{context}})"


###############################################################################
## [kind] - internal commands to manage kind through just 

# [private] assert that kind cluster exists
[no-exit-message]
@_assert_kind_cluster_exists context:
    (kind get clusters 2>/dev/null | grep >/dev/null '^{{context}}$') \
        || (just _error "kind cluster '{{context}}' not found... aborted"; exit 1)

# [private] check if the kind cluster doesn't exist
[no-exit-message]
@_assert_kind_cluster_not_exists context:
    (kind get clusters 2>/dev/null | grep >/dev/null '^{{context}}$') \
        || exit 0 \
        && (just _error "kind cluster '{{context}}' already exist... aborted"; exit 1)

# returns the current development cluster IP
[no-exit-message]
@_get_kind_cluster_address context: (_assert_kind_cluster_exists context)
    docker container inspect {{context}}-control-plane --format '{{{{ .NetworkSettings.Networks.kind.IPAddress }}'   

# [private] start kubernetes cluster
[no-exit-message]
_kind_create_cluster context: (_assert_kind_cluster_not_exists context)
    kind create cluster --name "{{context}}" --config "test/e2e/kind.cluster.yaml"

# [private] stop kubernetes cluster
[no-exit-message]
_kind_delete_cluster context: (_assert_kind_cluster_exists context)
    kind delete cluster --name "{{context}}"

# [private] import container image to a kind cluster
[no-exit-message]
_kind_import_image context image: (_assert_kind_cluster_exists context)
    kind load docker-image --name "{{context}}" "{{image}}"


###############################################################################
# [utils] - internal command to manipulate files and data

# [private] assert that the given file exists
[no-exit-message]
@_assert_utils_file_exists file:
    test -e "{{file}}" || (just _error "file '{{file}}' not found... aborted"; exit 1)

# [private] assert that the given file exists
[no-exit-message]
@_assert_utils_dir_exists directory:
    test -d "{{directory}}" || (just _error "directory '{{directory}}' not found... aborted"; exit 1)

# [private] build an image and send it to an existing kind cluster
_utils_prepare_image image path context: && (_kind_import_image context image)
    docker build "{{path}}" --tag "{{image}}"

# [private] inject Kubeapps component to local Belug-Apps chart
[no-exit-message]
@_utils_chart_inject_components: (_assert_utils_file_exists "src/kubeapps-components/dist/main.js")
    just _log "inject Kubeapps component inside Belug-Apps chart values"
    (echo 'customComponents: |'; sed 's/^/  /' 'src/kubeapps-components/dist/main.js') \
    | just _utils_inject 'kubeapps component' /dev/stdin charts/belug-apps/values.yaml 6

# [private] inject Kubernetes manifests to local Belug-Apps chart
[no-exit-message]
_utils_chart_inject_manifests flavor="default": (_assert_utils_dir_exists "manifests/" + flavor)
    #!/bin/env bash
    set -euo pipefail

    just _log "inject manifests inside Belug-Apps chart values"
    kustomize build 'manifests/{{flavor}}' | just _utils_inject 'kubernetes manifests' /dev/stdin charts/belug-apps/values.yaml 3

# [private] inject the content of the input file into the output file, between delimiters
[no-exit-message]
_utils_inject topic in out indent="0": (_assert_utils_file_exists in) (_assert_utils_file_exists in)
    #!/bin/env bash
    set -euo pipefail

    (
        echo "# [inject] {{topic}}"
        cat "{{in}}"
        echo; echo "# [end inject] {{topic}}"
    ) | sed "s/^/$(for i in $(seq {{indent}}); do echo -n "  "; done)/" \
      | sed \
          --expression='/# \[inject\] {{topic}}/,/# \[end inject\] {{topic}}/{/# \[inject\] {{topic}}/r /dev/stdin' \
          --expression='d}' \
          --in-place "{{out}}"


###############################################################################
## [print] - internal formatting library

# list of color indexes
_print_color_red := '1'
_print_color_green := '2'
_print_color_yellow := '3'
_print_color_blue := '4'
_print_color_magenta := '5'
_print_color_cyan := '6'
_print_color_white := '7'

# [private] output formatted messages
[no-exit-message]
_print message prefix color fd='&1':
    #!/bin/env bash
    test -t 1 \
        && echo >{{fd}} "$(tput bold){{ if prefix != "" { "$(tput setaf $color)$prefix: " } else { "" } }}$(tput setaf 7){{message}}$(tput sgr0)" \
        || echo >{{fd}} "{{ if prefix != "" { "$prefix: " } else { "" } }}{{message}}"

_log message fd='&1': (_print message '' '' fd)
_success message fd='&2': (_print message 'success' _print_color_green fd)
_debug message fd='&2': (_print message 'debug' _print_color_cyan fd)
_info message fd='&2': (_print message 'info' _print_color_cyan fd)
_warn message fd='&2': (_print message 'warn' _print_color_yellow fd)
_error message fd='&2': (_print message 'error' _print_color_red fd)
_fatal message fd='&2': (_print message 'fatal' _print_color_red fd)
