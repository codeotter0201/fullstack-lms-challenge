#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
E2E_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"
DEPLOY_DIR="$( cd "$E2E_DIR/../deploy" && pwd )"

cd "$E2E_DIR"

# 1. Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    print_header "Installing Dependencies"
    npm install
    print_success "Dependencies installed"
fi

# 2. Start test environment
print_header "Starting Test Environment"
cd "$DEPLOY_DIR"

print_info "Starting PostgreSQL, Backend, and Frontend services..."
docker-compose -f docker-compose.e2e.yml up -d postgres-test backend-test frontend-test

# 3. Wait for services to be healthy
print_header "Waiting for Services"
print_info "This may take 1-2 minutes..."

# Wait for backend
print_info "Waiting for backend to be ready..."
TIMEOUT=120
ELAPSED=0
while [ $ELAPSED -lt $TIMEOUT ]; do
    if docker-compose -f docker-compose.e2e.yml ps backend-test | grep -q "healthy"; then
        print_success "Backend is ready"
        break
    fi
    sleep 5
    ELAPSED=$((ELAPSED + 5))
    if [ $ELAPSED -ge $TIMEOUT ]; then
        print_error "Backend failed to start within ${TIMEOUT}s"
        docker-compose -f docker-compose.e2e.yml logs backend-test
        exit 1
    fi
done

# Wait for frontend
print_info "Waiting for frontend to be ready..."
ELAPSED=0
while [ $ELAPSED -lt $TIMEOUT ]; do
    if docker-compose -f docker-compose.e2e.yml ps frontend-test | grep -q "healthy\|Up"; then
        print_success "Frontend is ready"
        break
    fi
    sleep 5
    ELAPSED=$((ELAPSED + 5))
    if [ $ELAPSED -ge $TIMEOUT ]; then
        print_error "Frontend failed to start within ${TIMEOUT}s"
        docker-compose -f docker-compose.e2e.yml logs frontend-test
        exit 1
    fi
done

# Additional wait for services to be fully initialized
print_info "Waiting for services to fully initialize..."
sleep 10

# 4. Show service status
print_header "Service Status"
docker-compose -f docker-compose.e2e.yml ps

# 5. Run Playwright tests
print_header "Running E2E Tests"
cd "$E2E_DIR"

# Copy .env.example to .env if not exists
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_info "Created .env file from .env.example"
fi

# Run tests with all arguments passed through
TEST_EXIT_CODE=0
npx playwright test "$@" || TEST_EXIT_CODE=$?

# 6. Generate and display report info
if [ $TEST_EXIT_CODE -eq 0 ]; then
    print_success "All tests passed!"
else
    print_error "Some tests failed. Exit code: $TEST_EXIT_CODE"
fi

print_info "Test report available at: e2e/playwright-report/index.html"
print_info "To view report, run: npx playwright show-report"

# 7. Cleanup (optional - can be disabled for debugging)
if [ "$KEEP_ENV" != "true" ]; then
    print_header "Cleaning Up"
    cd "$DEPLOY_DIR"
    docker-compose -f docker-compose.e2e.yml down -v
    print_success "Environment cleaned up"
else
    print_info "Environment kept running (KEEP_ENV=true)"
    print_info "To stop manually: cd deploy && docker-compose -f docker-compose.e2e.yml down -v"
fi

exit $TEST_EXIT_CODE
