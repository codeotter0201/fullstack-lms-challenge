#!/bin/bash
# Run tests against local development environment (without Docker)

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
E2E_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

cd "$E2E_DIR"

# Set local environment variables
export BASE_URL=http://localhost:3000
export API_URL=http://localhost:8080
export TEST_ENV=local

echo "🧪 Running E2E tests against local development environment"
echo "📍 Frontend: $BASE_URL"
echo "🔌 Backend: $API_URL"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run tests
npx playwright test "$@"

echo ""
echo "📊 To view the test report, run:"
echo "   npx playwright show-report"
