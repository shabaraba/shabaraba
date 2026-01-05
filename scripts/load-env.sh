#!/bin/bash

# Load environment variables from .env file
# This script exports variables for use in subsequent commands

if [ -f .env ]; then
  # Export all non-comment, non-empty lines from .env
  export $(grep -v '^#' .env | grep -v '^$' | xargs)
  echo "✅ Environment variables loaded from .env"
else
  echo "⚠️  No .env file found"
fi

# Execute the passed command
exec "$@"
