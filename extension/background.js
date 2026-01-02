/*
 * WebAuthnLinux Background Script
 *
 * Original: Grammatopoulos Athanasios Vasileios (GramThanos)
 * Modifications by Samveen
 */
let popupWindowId = null;
let pendingRequest = null;
let contentScriptPort = null;

// Listen for messages from content scripts (injected page)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type === 'authenticator_ready') {
        // The popup is open and ready. Send the pending request.
        if (pendingRequest) {
            chrome.runtime.sendMessage(pendingRequest);
            // pendingRequest = null; // Keep it until completion? No, simple flow.
        }
        return;
    }

    // Message from the authenticator popup (completion)
    if (message.status === 'completed' || message.status === 'error') {
        // Forward to the tab that requested it

        // If we have a stored tab ID from the pending request, use it.
        if (pendingRequest && pendingRequest.requestingTabId) {
            console.log("WebAuthnLinux: Forwarding response to tab " + pendingRequest.requestingTabId);
            chrome.tabs.sendMessage(pendingRequest.requestingTabId, {
                ...message,
                extensionResponse: true
            });
            // Clear pending request after completion? 
            // Maybe wait a bit or clear it now. Let's clear it to be clean.
            // pendingRequest = null; 
        } else {
            // Fallback: Query active tab (less reliable if popup is focused or user switched tabs)
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        ...message,
                        extensionResponse: true // Flag to identify it
                    });
                }
            });
        }
        return;
    }

    // Message from the content script (requesting auth)
    if (message.action === 'trigger_authenticator') {
        pendingRequest = message.data;
        // Store the ID of the tab that requested this, so we can reply to the correct one later
        // message.data might not have it, but 'sender' does.
        if (sender.tab) {
            pendingRequest.requestingTabId = sender.tab.id;
        }

        // Open the popup
        chrome.windows.create({
            url: "authenticator.html",
            type: "popup",
            width: 400,
            height: 600,
            focused: true
        }, (window) => {
            popupWindowId = window.id;
        });

        sendResponse({ started: true });
        return true; // async response
    }
});
