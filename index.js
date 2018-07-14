const fetch = require('isomorphic-fetch');
const btoa = require('btoa');
const config = require('./config');

exports.accessToken = (req, res) => {
  const { code } = req.headers;
  if (req.headers.code === undefined) {
    console.log('Missing request header');
    res.status(401).send('Unauthorized');
  } else {
    const body = `grant_type=authorization_code&code=${encodeURIComponent(code)}&redirect_uri=${config.redirectUri}`;
    const headers = {
      'content-type': 'application/x-www-form-urlencoded',
      'authorization': 'Basic ' + btoa(`${config.clientId}:${config.clientKey}`)
    }
    fetch(config.accessTokenUrl, {
      method: 'POST',
      headers,
      body
    }).then(response => {
        return response.json().then((result) => {
          if(!response.ok) {
            console.log('Error requesting access token', result);
            res.status(401).send('Unauthorized');
          } else {
            res.send(result);
          }
        });
    }).catch(err => {
      console.log('Error requesting access token', err);
      res.status(401).send('Unauthorized');
    });
  }
};
