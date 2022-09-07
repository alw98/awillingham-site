#!/bin/bash
systemctl stop nginx

if [ "$DEPLOYMENT_GROUP_NAME" == "Test" ]
then
	systemctl stop PersonalSite@test
fi

if [ "$DEPLOYMENT_GROUP_NAME" == "Prod" ]
then	
	systemctl stop PersonalSite@prod
fi

rm /etc/nginx/conf.d/personalSite.conf -f
rm /etc/systemd/system/PersonalSite@.service -f
rm /opt/www/rex/aws-logger-errors.txt

echo "Stopped services and removed their files"