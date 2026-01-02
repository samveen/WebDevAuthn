#!/bin/bash
set -e

HOST_NAME="io.github.samveen.webdevauthn"
HOST_DIR="$HOME/.mozilla/native-messaging-hosts"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TARGET_HOST_PATH="$SCRIPT_DIR/webdevauthn_host.py"
MANIFEST_PATH="$SCRIPT_DIR/webdevauthn_host.json"

echo "Installing Native Messaging Host for WebDevAuthn..."

# Create Manifest
cat > "$MANIFEST_PATH" <<EOF
{
  "name": "$HOST_NAME",
  "description": "WebDevAuthn Native Host for Fingerprint Integration",
  "path": "$TARGET_HOST_PATH",
  "type": "stdio",
  "allowed_extensions": [
    "webdevauthn-linux@samveen.github.io"
  ]
}
EOF

# Install manifest
mkdir -p "$HOST_DIR"
cp "$MANIFEST_PATH" "$HOST_DIR/$HOST_NAME.json"

echo "Native Host registered at: $HOST_DIR/$HOST_NAME.json"
echo "Pointed to script: $TARGET_HOST_PATH"
echo "Done."
