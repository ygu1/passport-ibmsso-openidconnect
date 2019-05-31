# passport-ibm-openidconnect
This module provides the passport strategy for authenticating with IBMid and w3id OpenID Connect.

## Install

    $ npm install passport-ibm-openidconnect

## Usage

### Example

1) Without discovery endpoint example:
```
import Strategy from 'passport-ibm-openidconnect';
import fs from 'fs';

const strategy = new Strategy({
  authorizationURL: <Authorization Endpoint>,
  tokenURL: <Token EndPoint>,
  clientID: <Client ID>,
  scope: 'openid',
  response_type: 'code',
  clientSecret: <Client Secret>,
  callbackURL: <Redirect URI>,
  skipUserProfile: true,
  issuer: <Issuer>,
  certs: [
    fs.readFileSync(<Cert1 Path>),
    fs.readFileSync(<Cert2 Path>),
    ...
  ]
}, (iss, sub, profile, accessToken, refreshToken, params, done) => {
  process.nextTick(() => {
    profile._json.accessToken = accessToken;
    profile._json.refreshToken = refreshToken;
    return done(null, profile);
  });
});

passport.use(Strategy);
```

2) With discovery endpoint example:
```
import Strategy from 'passport-ibm-openidconnect';
import fs from 'fs';

const strategy = new Strategy({
  autoDiscovery: true,
  clientID: <Client ID>,
  scope: 'openid',
  response_type: 'code',
  clientSecret: <Client Secret>,
  callbackURL: <Redirect URI>,
  skipUserProfile: false,
  issuer: <Issuer>
}, (iss, sub, profile, accessToken, refreshToken, params, done) => {
  process.nextTick(() => {
    profile._json.accessToken = accessToken;
    profile._json.refreshToken = refreshToken;
    return done(null, profile);
  });
});

passport.use(Strategy);
```
