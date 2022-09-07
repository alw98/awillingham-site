#!/bin/bash

systemctl daemon-reload

chmod +x /opt/www/personal/Scripts/start_server.sh
if [ "$DEPLOYMENT_GROUP_NAME" == "Test" ]
then
	systemctl enable PersonalSite@test
	systemctl start PersonalSite@test
	systemctl status PersonalSite@test
fi

if [ "$DEPLOYMENT_GROUP_NAME" == "Prod" ]
then	
	systemctl enable PersonalSite@prod
	systemctl start PersonalSite@prod
	systemctl status PersonalSite@prod
fi

systemctl enable nginx
systemctl start nginx
systemctl status nginx