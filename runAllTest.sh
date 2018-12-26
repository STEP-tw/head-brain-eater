set -e
./scripts/runHead.sh
./scripts/runTail.sh
mocha
