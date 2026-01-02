/*
 * WebDevAuthn Injector Script
 *
 * Grammatopoulos Athanasios Vasileios (GramThanos)
 * Modifications by Samveen
 */
(function () {
	'use strict';


	// Relay messages from injected script to background
	window.addEventListener('message', function (event) {
		if (event.source !== window || !event.data || event.data.source !== 'webauthn-dev-injected') {
			return;
		}

		if (event.data.action === 'trigger_authenticator') {
			// Forward to background script
			try {
				if (chrome && chrome.runtime) { // Firefox uses browser, but chrome is usually aliased
					(chrome || browser).runtime.sendMessage(event.data, (response) => {
						// Optional acknowledgement
					});
				}
			} catch (e) {
				console.error("WebDevAuthn: Failed to contact background", e);
			}
		}
	});

	// Listen for messages from background (authenticator response) and forward to page
	try {
		(chrome || browser).runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (options && options['option@debugLogging']) {
				console.log("WebDevAuthn Logic: Received message from background", message);
			}
			if (message.extensionResponse) {
				if (options && options['option@debugLogging']) {
					console.log("WebDevAuthn Logic: Posting message to window");
				}
				window.postMessage({
					source: 'webauthn-dev-content-script',
					...message
				}, window.location.origin);
			}
		});
	} catch (e) { console.error("WebDevAuthn Logic: Error in listener", e); }


	let Browser = chrome || browser;
	let ready = false;
	let loaded = false;
	let options = false;

	let getBoolean = function (item) {
		// Default to TRUE if undefined (first run), effectively auto-enabling the dev mode
		if (options[item] === undefined) return true;
		return options[item] ? true : false;
	}

	let fireLoad = function () {
		if (loaded) return;
		ready = true;
		if (!options) return;
		loaded = true;
		// If turned off disable
		if (!getBoolean('option@development')) return;

		// Prepare script
		let script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', Browser.runtime.getURL('webauthn-dev.js'));
		// Parameters
		script.setAttribute('development', getBoolean('option@development'));
		script.setAttribute('virtual', getBoolean('option@virtual'));
		script.setAttribute('instance-of-pub-key', getBoolean('option@instance-of-pub-key'));
		script.setAttribute('debug-logging', getBoolean('option@debugLogging'));
		script.setAttribute('platform-authenticator-available', getBoolean('option@platform-authenticator-available'));
		// Insert on page
		document.head.appendChild(script);
	};

	// Load storage options
	Browser.storage.local.get([
		'option@virtual',
		'option@development',
		'option@instance-of-pub-key',
		'option@debugLogging',
		'option@platform-authenticator-available'
	], function (items) {
		options = items;
		if (!ready) fireLoad();
	});

	// Script injector loader
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
