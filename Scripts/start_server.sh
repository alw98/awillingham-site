#!/bin/bash

export ASPNETCORE_ENVIRONMENT=$1

/usr/bin/dotnet /opt/www/personal/bin/Release/net6.0/awillingham-site.dll --no-launch-profile