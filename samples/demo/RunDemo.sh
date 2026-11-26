#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p ../output_files
cd ../..
exec node samples/demo/demo.js --suite office "$@"
