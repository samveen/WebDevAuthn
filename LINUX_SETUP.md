# Linux Native Messaging Setup

This extension uses a native messaging host to communicate with the system's fingerprint reader and FIDO2 devices. This allows you to use your laptop's built-in fingerprint reader for WebAuthn in this development environment.

## Prerequisites

Before installing the native host, ensure your system has the necessary dependencies installed.

### 1. Fingerprint Service (fprintd)
The native host uses `fprintd` to verify your identity.
- **Install**:
  ```bash
  sudo apt install fprintd libpam-fprintd
  ```
- **Enroll Fingerprint**:
  Ensure you have at least one fingerprint enrolled.
  ```bash
  fprintd-enroll
  ```
- **Verify**:
  Run `fprintd-verify` to ensure it works.

### 2. FIDO2 Tools (Optional)
Required primarily for interacting with physical FIDO2 keys.
- **Install**:
  ```bash
  sudo apt install fido2-tools
  ```

### 3. PCSC Daemon (Optional)
Required for smart card interaction (some physical FIDO2 keys). **NOT required for fingerprint authentication.**
- **Install**:
  ```bash
  sudo apt install pcscd
  sudo systemctl start pcscd
  sudo systemctl enable pcscd
  ```

### 4. U2F Udev Rules
To allow non-root access to FIDO2 devices.
- **Install**:
  ```bash
  sudo apt install libu2f-udev
  ```
  *(You may need to unplug and replug your device or reboot for rules to take effect.)*

## Installation

1.  Navigate to the `native` directory of the repository.
2.  Run the installation script:
    ```bash
    ./install.sh
    ```
    This script will:
    - Create a manifest file `io.github.samveen.webdevauthn.json`.
    - Install it into `~/.mozilla/native-messaging-hosts/`.
    - Point it to the `webdevauthn_host.py` script.

## Verification

You can run the included check script to verify your environment:
```bash
./check_fingerprint.sh
```
This script checks for the presence of `fprintd`, enrolled fingerprints, `fido2-tools`, and the status of `pcscd`.

## Troubleshooting

-   **Browser Console Errors**: Check the browser console if the extension fails to connect.
-   **Permissions**: Ensure `webdevauthn_host.py` is executable (`chmod +x webdevauthn_host.py`).
-   **Firefox Config**: Ensure `security.webauth.u2f` is set to `true` in `about:config` (for older Firefox versions).
