const fetch = require('isomorphic-fetch');
const btoa = require('btoa');
const config = require('./config');

function requestToken(body) {
  const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    'authorization': 'Basic ' + btoa(`${config.clientId}:${config.clientKey}`)
  }
  return fetch(config.accessTokenUrl, {
    method: 'POST',
    headers,
    body
  });
}

exports.accessToken = (req, res) => {
  const { code } = req.headers;
  if (!req.headers.code) {
    console.log('Missing request header');
    res.status(401).send('Unauthorized');
  } else {
    const body = `grant_type=authorization_code&code=${encodeURIComponent(code)}&redirect_uri=${config.redirectUri}`;
    return requestToken(body).then(response => {
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

exports.refreshToken = (req, res) => {
  const { rftoken } = req.headers;
  if (!req.headers.rftoken) {
    console.log('Missing request header');
    res.status(401).send('Unauthorized');
  } else {
    const body = `grant_type=refresh_token&refresh_token=${encodeURIComponent(rftoken)}`;
    return requestToken(body).then(response => {
      return response.json().then((result) => {
        if(!response.ok) {
          console.log('Error requesting refresh token', result);
          res.status(401).send('Unauthorized');
        } else {
          res.send(result);
        }
      });
    }).catch(err => {
      console.log('Error requesting refresh token', err);
      res.status(401).send('Unauthorized');
    });
  }
};
