#!/bin/bash
mv /opt/www/personal/DevOps/personalSite.conf /etc/nginx/conf.d/personalSite.conf
echo "Moved nginx configuration"

mv /opt/www/personal/DevOps/PersonalSite@.service /etc/systemd/system/PersonalSite@.service
echo "Moved service file"

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install 16
nvm use 16
echo "Installed nvm and npm"

cd /opt/www/personal/
dotnet build --configuration release

cd /opt/www/personal/Web/web-app/
npm install

if [ "$DEPLOYMENT_GROUP_NAME" == "Test" ]
then
	npm run bundle:test
fi
if [ "$DEPLOYMENT_GROUP_NAME" == "Prod" ]
then
	npm run bundle:prod
fi

echo "Built ASP.NET app and frontend bundle"