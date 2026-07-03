#!/bin/bash
# Double-click this file to launch the Manza Hoops Daily News Database.
# It starts the local app and opens it in your browser. Close the Terminal
# window (or press Ctrl+C) when you're done to stop it.

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR/app" || exit 1

echo "Starting Manza Hoops — Daily News Database…"

# Capture server output so we can read the actual port (it auto-bumps if 4321 is busy)
TMPLOG=$(mktemp)
node server.js 2>&1 | tee "$TMPLOG" &
SERVER_PID=$!

# Wait for the port line to appear (up to 5 seconds)
PORT=""
for i in $(seq 1 50); do
  PORT=$(grep -o 'localhost:[0-9]*' "$TMPLOG" | head -1 | cut -d: -f2)
  [ -n "$PORT" ] && break
  sleep 0.1
done
rm -f "$TMPLOG"

if [ -n "$PORT" ]; then
  open "http://localhost:$PORT"
else
  echo "Warning: could not detect port, opening default."
  open "http://localhost:4321"
fi

wait $SERVER_PID
