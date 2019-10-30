#!/usr/bin/env bash

curl "https://raw.githubusercontent.com/helm/helm/master/scripts/get" > install-helm-tmp.sh
DESIRED_VERSION=v2.13.0 sh install-helm-tmp.sh
helm init --client-only
rm install-helm-tmp.sh

echo Installing Helm complete
