/*
 * WebAuthnLinux Injector Script
 *
 * Original: Grammatopoulos Athanasios Vasileios (GramThanos)
 * Modifications by Samveen
 */
(function () {
	'use strict';

	// Relay messages from injected script to background
	window.addEventListener('message', function (event) {
		if (event.source !== window || !event.data || event.data.source !== 'webauthn-linux-injected') {
			return;
		}

		if (event.data.action === 'trigger_authenticator') {
			// Forward to background script
			try {
				if (chrome && chrome.runtime) {
					chrome.runtime.sendMessage(event.data, (response) => {
						// Optional acknowledgement
					});
				}
			} catch (e) {
				console.error("WebAuthnLinux: Failed to contact background", e);
			}
		}
	});

	// Listen for messages from background (authenticator response) and forward to page
	try {
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (message.extensionResponse) {
				window.postMessage({
					source: 'webauthn-linux-content-script',
					...message
				}, window.location.origin);
			}
		});
	} catch (e) { console.error("WebAuthnLinux: Error in listener", e); }


	let Browser = chrome || browser;
	let ready = false;
	let loaded = false;
	let options = false;

	let getBoolean = function (item) {
		if (options[item] === undefined) return true;
		return options[item] ? true : false;
	}

	let fireLoad = function () {
		if (loaded) return;
		ready = true;
		if (!options) return;
		loaded = true;

		// The extension must be enabled. If option@development is the primary toggle:
		if (!getBoolean('option@development')) return;

		// Inject the core script
		let script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', Browser.runtime.getURL('webauthn-linux.js'));

		// Pass necessary attributes
		script.setAttribute('instance-of-pub-key', getBoolean('option@instance-of-pub-key'));
		script.setAttribute('debug-logging', getBoolean('option@debugLogging'));

		document.head.appendChild(script);
	};

	// Load storage options
	Browser.storage.local.get([
		'option@development',
		'option@instance-of-pub-key',
		'option@debugLogging'
	], function (items) {
		options = items;
		if (!ready) fireLoad();
	});

	// Loader
	if (document.readyState == 'interactive' || document.readyState == 'complete') {
		fireLoad();
	} else {
		window.addEventListener('DOMContentLoaded', fireLoad, true);
		window.addEventListener('load', fireLoad, true);

		let o = new MutationObserver(() => {
			if (document.head) {
				o.disconnect();
				fireLoad();
			}
		});
		o.observe(document, { childList: true });
	}

}());
