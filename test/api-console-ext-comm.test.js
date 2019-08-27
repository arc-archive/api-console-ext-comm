import { fixture, assert, aTimeout } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import { ChromeApiMock } from './api-mock.js';
import '../api-console-ext-comm.js';

describe('<api-console-ext-comm>', function() {
  async function basicFixture() {
    return (await fixture(`<api-console-ext-comm></api-console-ext-comm>`));
  }

  describe('communication test', () => {
    const eventTarget = document.createElement('div');
    const service = new ChromeApiMock();

    before(() => {
      document.body.appendChild(eventTarget);
      service.register();
    });

    after(() => {
      document.body.removeChild(eventTarget);
      service.unregister();
    });

    describe('installation flow', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
        element.eventTarget = eventTarget;
      });

      it('hasExtension is eventually set up', (done) => {
        element.addEventListener('hasextension-changed', function clb() {
          element.removeEventListener('hasextension-changed', clb);
          assert.isTrue(element.hasExtension);
          done();
        });
      });

      it('Dispatches api-console-extension-installed event', (done) => {
        element.addEventListener('api-console-extension-installed', function clb(e) {
          element.removeEventListener('api-console-extension-installed', clb);
          assert.isTrue(e.bubbles, 'The event bubbles');
          done();
        });
      });
    });

    describe('a11y', () => {
      it('is accessible', async () => {
        const element = await basicFixture();
        await assert.isAccessible(element);
      });
    });

    describe('api-request event handling', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
        element.eventTarget = eventTarget;
        await aTimeout(10);
      });

      function fireRequestEvent(node) {
        const e = new CustomEvent('api-request', {
          cancelable: true,
          bubbles: true,
          composed: true,
          detail: {
            headers: 'content-type: application/test',
            id: 'test-id',
            method: 'GET',
            payload: '--test--',
            url: 'domain.com'
          }
        });
        node.dispatchEvent(e);
        return e;
      }

      it('cancels api-request event', () => {
        const e = fireRequestEvent(eventTarget);
        assert.isTrue(e.defaultPrevented);
      });

      it('stops api-request event bubbling', () => {
        const spy = sinon.spy();
        document.body.addEventListener('api-request', spy);
        fireRequestEvent(eventTarget);
        assert.isFalse(spy.called);
      });

      it('sets the request in the active requests queue', () => {
        fireRequestEvent(eventTarget);
        assert.ok(element._activeRequests['test-id']);
      });

      it('does not handles event from outside event target', () => {
        const e = fireRequestEvent(document);
        assert.isFalse(e.defaultPrevented);
      });

      it('Dispatches api-response event', (done) => {
        document.body.addEventListener('api-response', function clb() {
          document.body.removeEventListener('api-response', clb);
          done();
        });
        fireRequestEvent(eventTarget);
      });

      it('The respnse contains request data', (done) => {
        setTimeout(() => fireRequestEvent(eventTarget), 5);
        document.body.addEventListener('api-response', function clb(e) {
          document.body.removeEventListener('api-response', clb);
          assert.typeOf(e.detail.request, 'object');
          done();
        });
      });

      it('The respnse contains request id', (done) => {
        setTimeout(() => fireRequestEvent(eventTarget), 5);
        document.body.addEventListener('api-response', function clb(e) {
          document.body.removeEventListener('api-response', clb);
          assert.equal(e.detail.id, 'test-id');
          done();
        });
      });

      it('Clears request from active requests', (done) => {
        setTimeout(() => fireRequestEvent(eventTarget), 5);
        document.body.addEventListener('api-response', function clb() {
          document.body.removeEventListener('api-response', clb);
          assert.isUndefined(element._activeRequests['test-id']);
          done();
        });
      });
    });

    describe('oauth2-token-requested event handling', () => {
      let element;
      beforeEach(async () => {
        element = await basicFixture();
        element.eventTarget = eventTarget;
        await aTimeout(10);
      });

      function fireTokenEvent(node) {
        const e = new CustomEvent('oauth2-token-requested', {
          cancelable: true,
          bubbles: true,
          composed: true,
          detail: {
            state: 'test-state'
          }
        });
        node.dispatchEvent(e);
        return e;
      }

      it('Cancels oauth2-token-requested event', () => {
        const e = fireTokenEvent(eventTarget);
        assert.isTrue(e.defaultPrevented);
      });

      it('stops oauth2-token-requested event bubbling', () => {
        const spy = sinon.spy();
        document.body.addEventListener('oauth2-token-requested', spy);
        fireTokenEvent(eventTarget);
        assert.isFalse(spy.called);
      });

      it('Does not handles event from outside event target', () => {
        const e = fireTokenEvent(document.body);
        assert.isFalse(e.defaultPrevented);
      });

      it('Dispatches oauth2-token-response event', (done) => {
        document.body.addEventListener('oauth2-token-response', function clb() {
          document.body.removeEventListener('oauth2-token-response', clb);
          done();
        });
        setTimeout(() => fireTokenEvent(eventTarget), 5);
      });

      it('Event contains response data', (done) => {
        setTimeout(() => fireTokenEvent(eventTarget), 5);
        document.body.addEventListener('oauth2-token-response', function clb(e) {
          document.body.removeEventListener('oauth2-token-response', clb);
          assert.equal(e.detail.state, 'test-state', 'state is set');
          assert.equal(e.detail.accessToken, 'tokenValue', 'accessToken is set');
          assert.equal(e.detail.tokenType, 'bearer', 'tokenType is set');
          assert.equal(e.detail.expiresIn, 3600, 'expiresIn is set');
          assert.equal(e.detail.tokenTime, 1234, 'tokenTime is set');
          done();
        });
      });
    });
  });
});
