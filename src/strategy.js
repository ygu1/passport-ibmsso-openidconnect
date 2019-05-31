import { IDaaSOIDCStrategy } from 'passport-idaas-openidconnect';
import rp from 'request-promise';

export default class Strategy {
  constructor(options, verify) {
    const tempOptions = options || {};

    if (!tempOptions.issuer) throw new Error('IBMidOIDCStrategy requires a issuer option');
    if (!tempOptions.clientID) throw new Error('IBMidOIDCStrategy requires a clientID option');
    if (!tempOptions.clientSecret) throw new Error('IBMidOIDCStrategy requires a clientSecret option');
    if (!tempOptions.callbackURL) throw new Error('IBMidOIDCStrategy requires a callbackURL option');

    Object.assign(this, options);
    this.verify = verify;
  }

  async init() {
    try {
      const openidOptions = {
        clientID: this.clientID,
        clientSecret: this.clientSecret,
        issuer: this.issuer,
        callbackURL: this.callbackURL,
        scope: this.scope ? this.scope : '',
        response_type: this.response_type ? this.response_type : '',
      };
      let certs = [];
      if (this.autoDiscovery) {
        const options = {
          method: 'GET',
          url: `${this.issuer}/.well-known/openid-configuration`,
          json: true,
        };
        const response = await rp(options);
        if (response) {
          Object.assign(openidOptions, {
            authorizationURL: response.authorization_endpoint,
            tokenURL: response.token_endpoint,
            userInfoURL: response.userinfo_endpoint,
            skipUserProfile: false,
          });
          const jwkOptions = {
            method: 'GET',
            url: response.jwks_uri,
            json: true,
          };
          const jwkResponse = await rp(jwkOptions);
          if (jwkResponse) {
            certs = jwkResponse.keys.map((k) => {
              const buffer = Buffer.from(`-----BEGIN CERTIFICATE-----\r\n${k.x5c[0]}\r\n-----END CERTIFICATE-----`, 'utf8');
              return buffer;
            });
          } else {
            throw new Error('Cannot retrieve JWKs info');
          }
        } else {
          throw new Error('Cannot retrieve metadata from discoveryURL');
        }
      } else {
        Object.assign(openidOptions, {
          authorizationURL: this.authorizationURL,
          tokenURL: this.tokenURL,
          userInfoURL: this.userInfoURL ? this.userInfoURL : '',
          skipUserProfile: true,
        });
        certs = this.certs ? this.certs : [];
      }
      this.openid = new IDaaSOIDCStrategy(openidOptions, this.verify);
      this.openid.name = 'ibmopenidconnect';
      if (certs.length > 0) {
        this.openid._certs = certs;
      }
    } catch (e) {
      throw e;
    }
  }
}
