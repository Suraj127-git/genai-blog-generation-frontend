#!/bin/sh
# Health check script for Railway deployment
# This script verifies the frontend application is healthy

# Check if nginx is running
if ! pgrep nginx > /dev/null; then
    echo "❌ nginx is not running"
    exit 1
fi

# Check if the application is responding
if curl -f -s http://localhost:80/health > /dev/null; then
    echo "✅ Health check passed"
    exit 0
else
    echo "❌ Health check failed"
    exit 1
fi