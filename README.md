[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-console-ext-comm.svg)](https://www.npmjs.com/package/@api-components/api-console-ext-comm)

[![Build Status](https://travis-ci.org/advanced-rest-client/api-url-data-model.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/api-console-ext-comm)

# api-console-ext-comm

Element that support communication with the api-console-extension.
It is used in API Console project.

## Usage

### Installation
```
npm install --save @api-components/api-console-ext-comm
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@api-components/api-console-ext-comm/api-console-ext-comm.js';

class SampleElement extends PolymerElement {
  render() {
    return html`
    <api-console-ext-comm
      @hasextension-changed="${this._extensionDetectedHandler}"></api-console-ext-comm>
    `;
  }

  _extensionDetectedHandler(e) {
    console.log('The browser has API console extension');
  }
}
customElements.define('sample-element', SampleElement);
```

## Development

```sh
git clone https://github.com/advanced-rest-client/api-console-ext-comm
cd api-console-ext-comm
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests
```sh
npm test
```
