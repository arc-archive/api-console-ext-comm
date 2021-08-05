/**
 * A class that mocks content script communication.
 */
export class ChromeApiMock {
  constructor() {
    this.oauthError = false;
    this._messageHandler = this._messageHandler.bind(this);
  }

  register() {
    window.addEventListener('message', this._messageHandler);
  }

  unregister() {
    window.removeEventListener('message', this._messageHandler);
  }

  _messageHandler(e) {
    switch (e.data.payload) {
      case 'api-console-extension-installed':
        this._handleInstalled();
        break;
      case 'api-console-request':
        this._handleRequest(e.data.detail);
        break;
      case 'api-console-oauth2':
        this._handleToken(e.data.detail);
        break;
      default:
    }
  }

  _handleInstalled() {
    setTimeout(() => {
      window.postMessage({
        'api-console-payload': 'init',
        'api-console-extension': true
      }, window.location.origin);
    });
  }

  _handleRequest(data) {
    setTimeout(() => {
      window.postMessage({
        'api-console-payload': 'api-console-response',
        'api-console-extension': true,
        'api-console-data': {
          logs: [],
          data: {
            id: data.id,
            request: {},
            response: {}
          }
        }
      }, window.location.origin);
    });
  }

  _handleToken(detail) {
    let response;
    if (this.oauthError) {
      response = {
        error: true,
        interactive: false,
        message: 'error',
        state: detail.state
      };
    } else {
      response = {
        state: detail.state,
        accessToken: 'tokenValue',
        tokenType: 'bearer',
        expiresIn: '3600', // this is query parameter so it's string
        tokenTime: 1234
      };
    }

    setTimeout(() => {
      window.postMessage({
        'api-console-payload': 'api-console-oauth2-token-response',
        'api-console-extension': true,
        'api-console-data': response
      }, window.location.origin);
    });
  }
}
