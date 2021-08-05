import { LitElement } from 'lit-element';

/**
 * `<api-console-ext-comm>` is an element that support communication with
 * the api-console-extension.
 *
 * If the extension is installed then it will intercept the `api-request`
 * and cancel it.
 *
 * Data from the event are passed to the extension and the request is to
 * be executed from within the extension.
 * 
 * @fires hasextension-changed
 * @fires api-console-extension-installed
 * @fires api-response
 * @fires oauth2-error
 * @fires oauth2-token-response
 */
export default class ApiConsoleExtCommElement extends LitElement {
  /**
   * If true then the API console extension has been detected.
   */
  get hasExtension(): boolean;
  /**
  * An event handler for the API console events (request, abort,
  * token request etc). By default it uses body but it should be
  * the console if possible or the request panel.
  */
  eventTarget: EventTarget;
  _eventTarget: EventTarget;
  /**
  * List of active requests sent to the extension.
  * The key is request ID (generated by the console) and the value
  * is the request data.
  */
  _activeRequests: Record<string, any>;

  _hasExtension: boolean;
  

  constructor();

  connectedCallback(): void;

  disconnectedCallback(): void;
  
  /**
   * Posts message on a window object to request an event from the
   * extension if it is installed.
   */
  _notifyExtension(): void;
  
  /**
   * Handler for event target change. Removes listener from old
   * handler and sets up API console event listeners on the node.
   * @param et New event target
   */
  _eventTargetChanged(et: EventTarget, old: EventTarget): void;

  /**
   * Sets up API console event listeners on the target node.
   * @param node Target for the events
   */
  _observerConsoleEvents(node: EventTarget): void;

  /**
   * Removes API console event listeners from the target node.
   * @param node Target for the events
   */
  _unobserveConsoleEvents(node: EventTarget): void;

  /**
   * A handler for the message event dispatched on window object.
   * This is used in communication with an extension.
   */
  _messageHandler(e: MessageEvent): void;
  /**
   * A handler for API console request event
   */
  _requestHandler(e: CustomEvent): void;

  /**
   * A handler for API console abort request handler.
   */
  _abortHandler(e: CustomEvent): void;

  /**
   * A handler for API console OAuth2 token request handler.
   */
  _oauthTokenHandler(e: CustomEvent): void;

  /**
   * Called when the api-console-extension is detected.
   */
  _extensionDetected(): void;

  /**
   * A handler for the response notified by the extension.
   */
  _responseReady(data: any): void;

  /**
   * Handler for OAuth token response.
   */
  _oauthTokenReady(data: any): void;
}
