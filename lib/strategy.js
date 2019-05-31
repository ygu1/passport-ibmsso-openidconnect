"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _passportIdaasOpenidconnect = require("passport-idaas-openidconnect");

var _requestPromise = _interopRequireDefault(require("request-promise"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Strategy =
/*#__PURE__*/
function () {
  function Strategy(options, verify) {
    _classCallCheck(this, Strategy);

    var tempOptions = options || {};
    if (!tempOptions.issuer) throw new Error('IBMidOIDCStrategy requires a issuer option');
    if (!tempOptions.clientID) throw new Error('IBMidOIDCStrategy requires a clientID option');
    if (!tempOptions.clientSecret) throw new Error('IBMidOIDCStrategy requires a clientSecret option');
    if (!tempOptions.callbackURL) throw new Error('IBMidOIDCStrategy requires a callbackURL option');
    Object.assign(this, options);
    this.verify = verify;
  }

  _createClass(Strategy, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        var openidOptions, certs, options, response, jwkOptions, jwkResponse;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                openidOptions = {
                  clientID: this.clientID,
                  clientSecret: this.clientSecret,
                  issuer: this.issuer,
                  callbackURL: this.callbackURL,
                  scope: this.scope ? this.scope : '',
                  response_type: this.response_type ? this.response_type : ''
                };
                certs = [];

                if (!this.autoDiscovery) {
                  _context.next = 24;
                  break;
                }

                options = {
                  method: 'GET',
                  url: "".concat(this.issuer, "/.well-known/openid-configuration"),
                  json: true
                };
                _context.next = 7;
                return (0, _requestPromise["default"])(options);

              case 7:
                response = _context.sent;

                if (!response) {
                  _context.next = 21;
                  break;
                }

                Object.assign(openidOptions, {
                  authorizationURL: response.authorization_endpoint,
                  tokenURL: response.token_endpoint,
                  userInfoURL: response.userinfo_endpoint,
                  skipUserProfile: false
                });
                jwkOptions = {
                  method: 'GET',
                  url: response.jwks_uri,
                  json: true
                };
                _context.next = 13;
                return (0, _requestPromise["default"])(jwkOptions);

              case 13:
                jwkResponse = _context.sent;

                if (!jwkResponse) {
                  _context.next = 18;
                  break;
                }

                certs = jwkResponse.keys.map(function (k) {
                  var buffer = Buffer.from("-----BEGIN CERTIFICATE-----\r\n".concat(k.x5c[0], "\r\n-----END CERTIFICATE-----"), 'utf8');
                  return buffer;
                });
                _context.next = 19;
                break;

              case 18:
                throw new Error('Cannot retrieve JWKs info');

              case 19:
                _context.next = 22;
                break;

              case 21:
                throw new Error('Cannot retrieve metadata from discoveryURL');

              case 22:
                _context.next = 26;
                break;

              case 24:
                Object.assign(openidOptions, {
                  authorizationURL: this.authorizationURL,
                  tokenURL: this.tokenURL,
                  userInfoURL: this.userInfoURL ? this.userInfoURL : '',
                  skipUserProfile: true
                });
                certs = this.certs ? this.certs : [];

              case 26:
                this.openid = new _passportIdaasOpenidconnect.IDaaSOIDCStrategy(openidOptions, this.verify);
                this.openid.name = 'ibmopenidconnect';

                if (certs.length > 0) {
                  this.openid._certs = certs;
                }

                _context.next = 34;
                break;

              case 31:
                _context.prev = 31;
                _context.t0 = _context["catch"](0);
                throw _context.t0;

              case 34:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 31]]);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }]);

  return Strategy;
}();

exports["default"] = Strategy;