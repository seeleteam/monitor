# Seele Network Stats Monitor

This is a visual dashboard for tracking seele network status. It uses WebSockets to receive stats realtime data from running nodes and display them through vue framework.

## Prerequisite
### development mode
* node
* npm
### production mode
* node
* npm
* pm2
* pm2-web
* nginx

## Installation
### dev mode
make sure you have node.js and npm installed
``` bash
# clone monitor repository
git clone https://github.com/seeleteam/monitor
cd monitor
# install the dependencies
npm install
# start monitor vue backend
node server/app.js
# start monitor vue front
npm start
```
### production mode
make sure you have node.js,npm,pm2,pm2-web,nginx installed
``` bash
# clone monitor repository
git clone https://github.com/seeleteam/monitor
cd monitor
# install the dependencies
npm install
# build production output
npm run build
# start monitor vue backend
pm2 start config/process.json
# deploy monitor vue front
cp -r dist /usr/local/nginx/seele-monitor
# config nginx server
...
# reload nginx
nginx -s reload
```

## Config Item Description
### config/dev.env.js
``` bash
NODE_ENV: '"development"',  // dev mode
BOWER_SERVER: '"ws://localhost:3000/bower"', // monitor backend websocket server
BOWER_CLIENT_HEARTCHECK_TIMEOUT: 5000, // monitor vue client heartcheck timeout
BOWER_CLIENT_RECONNECT_TIMEOUT: 5000 // monitor vue client reconnect timeout
```
### config/prod.env.js
``` bash
NODE_ENV: '"production"', // prod mode
BOWER_SERVER: '"ws://IP:3000/bower"', // monitor backend websocket server
BOWER_CLIENT_HEARTCHECK_TIMEOUT: 5000, // monitor vue client heartcheck timeout
BOWER_CLIENT_RECONNECT_TIMEOUT: 5000 // monitor vue client reconnect timeout
```
### config/process.json
``` bash
{
    "apps" : [
      {
        "name" : "monitor_server", // monitor backend server name
        "script" : "server/app.js", // monitor backend server entry script
        "watch": ["server"], 
        "interpreter": "node", // monitor backend server start command
        "env": {
          "NODE_ENV": "development",
          "SERVER_NGINX": 1, // monitor backend deploy to nginx flag
          "WS_CLIENT_CONN_TIMEOUT": 15, // check monitor client offline timeout
          "WS_CLIENT_CONN_INTERVAL": 30000, // check all monitor client offline interval
          "SERVER_PORT": 3000, // monitor backend port
          "BOWER_SERVER_DATA_UPDATE_INTERVAL": 5000 // monitor backend data update interval
        },
        "env_production" : {
          "NODE_ENV": "production",
          "SERVER_NGINX": 1,
          "WS_CLIENT_CONN_TIMEOUT": 15,
          "WS_CLIENT_CONN_INTERVAL": 30000,
          "SERVER_PORT": 3000,
          "BOWER_SERVER_DATA_UPDATE_INTERVAL": 5000
        }
      }
    ]
}
```
## View
see seele monitor at http://localhost:3001(default)

## Commands
### npm commands
``` bash
# install dependencies
npm install
# websocket server localhost:3000
npm run server  
# serve with hot reload at localhost:3001
npm run dev
# data client for test
npm run client_test
# build for production with minification
npm run build
# build for production and view the bundle analyzer report
npm run build --report
# run unit tests
npm run unit
# run e2e tests
npm run e2e
# run all tests
npm test
```
### pm2 commands
``` bash
# start monitor server
pm2 start config/process.json
# stop monitor server
pm2 stop config/process.json
# restart monitor server
pm2 restart config/process.json
# reload monitor server
pm2 reload config/process.json
# delete monitor server
pm2 delete process.json
# start pm2-web manage
pm2-web --config pm2_web.json
```