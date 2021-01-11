const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const { defaultserver, ssl } = require('./config/config');

const app = express()
const privateKey  = fs.readFileSync(ssl.privateKeyPath, 'utf8');
const certificate = fs.readFileSync(ssl.certificatePath, 'utf8');

app.use(bodyParser.urlencoded({ extended: true }));
app.post(`/~~${defaultserver.id}/action.php`, (request, response) => {
  axios({
    method: 'POST',
    url: 'https://play.pokemonshowdown.com/action.php',
    headers: request.headers,
    data: request.body,
  }).then((res) => response.send(res.data));
});
app.use('*.php', (request, response) => response.sendStatus(404));
app.use(express.static('./public', { index: 'index.html', fallthrough: true }));
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, './public/index.html'));
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer({ key: privateKey, cert: certificate }, app);

httpServer.listen(80, () => console.log('Listening on 80'));
httpsServer.listen(443, () => console.log('Listening on 443'));
