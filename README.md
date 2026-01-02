# WebDevAuthn

> **Fork Note**: This fork (**WebAuthnLinux**) extends the original tool with Native Messaging support for Linux Fingerprint integration.

#### Original
A tool to test &amp; analyze FIDO2/WebAuthn requests and responses

 - WebDevAuthn Web Tool: https://gramthanos.github.io/WebDevAuthn/
 - Chrome Extension: https://chrome.google.com/webstore/detail/webdevauthn/aofdjdfdpmfeohecddhgdjfnigggddpd
 - Firefox Extension: https://addons.mozilla.org/firefox/addon/webdevauthn/

___

### Description

This fork enables **Linux System Integration** by adding a Native Messaging Host for Linux.

The linux specific extension relies on a Python script running as a Native Messaging Host to bridge the gap between the browser and the Linux fingerprint service.

See [LINUX_SETUP.md](LINUX_SETUP.md) for detailed installation and setup instructions.

The native host script is located in the `native/` folder. This allows the extension to leverage the host system's fingerprint reader (via `fprintd`) for user verification events, bridging the gap between the browser and OS-level biometrics for development purposes, bypassing the need for the github-hosted webservice.

#### Original

WebDevAuthn is a web tool for testing and analyzing [FIDO2/WebAuthn](https://en.wikipedia.org/wiki/WebAuthn) requests and responses. The web application can work as a playground, letting developers experiment and understand the WebAuthn internals while also allowing the testing and experimentation of FIDO2 authenticator devices. Furthermore, developers may use this tool's injector (embedded code or an extension) to hijack WebAuthn calls and analyse them. The tool also features an advanced virtual authenticator that can emulate WebAuthn responses.

This repository is part of the research conducted for the papers:
- A web tool for analyzing FIDO2/WebAuthn Requests and Responses [https://doi.org/10.1145/3465481.3469209](https://doi.org/10.1145/3465481.3469209)
- Blind software-assisted conformance and security assessment of FIDO2/WebAuthn implementations [https://doi.org/10.22667/JOWUA.2022.06.30.096](https://doi.org/10.22667/JOWUA.2022.06.30.096)

Analyser Features:
- Capture WebAuthn requests
- Analyse WebAuthn options (show info, warnings & errors)
- Unpack/Decode WebAuthn authenticator responses
- Virtual Authenticator Device (for custom responses)

Virtual Authenticator Device:
- OS independent
- Supports packed attestation
- Supports wrapped keys to credentials ID
- Access to the private key of the generated credentials
- Testing mode to assess implementations
- Multiple supported algorithms

___


### Contact me

This derivative work is hosted at [https://github.com/samveen/WebDevAuthn](https://github.com/samveen/WebDevAuthn)
The original work can be found by navigating to this fork's parent.

#### Original
Please feel free to contact me to leave me your feedback or to express your thoughts.

You can [open an issue](https://github.com/GramThanos/WebDevAuthn/issues) or [send me a mail](mailto:gramthanos@gmail.com)
You can also find the derivative work at [https://github.com/samveen/WebDevAuthn](https://github.com/samveen/WebDevAuthn)

___


### About

This project consists of two main components:
- **`extension/`**: The Web Extension source code (Manifest V3). It has been updated to include `nativeMessaging` permissions and logic to communicate with the local host script.
- **`native/`**: A Python-based Native Messaging Host (`webdevauthn_host.py`) and installer (`install.sh`). This script runs in the background when invoked by the extension, verifying fingerprints using `fprintd-verify` and managing a secure master key for cryptographic operations.

The Derivative Work is Copyright (c) 2026 Onwards, Projects by Samveen.

The Copyright of all unmodified work remains Copyright (c) The Original Authors.

#### Original
This web application was developed as part of my thesis for the postgraduate programme "Digital Systems Security" and research conducted as part of the [Systems Security Laboratory](https://laboratories.ds.unipi.gr/ssl/)

[University of Piraeus](https://www.unipi.gr/), [Department of Digital Systems](https://www.ds.unipi.gr/), Digital Systems Security

Copyright (c) 2021 Onwards, Grammatopoulos Athanasios-Vasileios
___

[![GramThanos](https://avatars2.githubusercontent.com/u/14858959?s=42&v=4)](https://github.com/GramThanos)
Modified by [Samveen](https://github.com/samveen), largely thanks to [AntiGravity](https://antigravity.google)
