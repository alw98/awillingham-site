#!/bin/bash
yum update -y
rpm -Uvh https://packages.microsoft.com/config/centos/7/packages-microsoft-prod.rpm
yum install dotnet-sdk-6.0 curl -y
echo "Installed dotnet sdk"

amazon-linux-extras install nginx1 -y
echo "Installed nginx"