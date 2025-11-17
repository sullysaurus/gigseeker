#!/bin/bash

# Script to discover 100 venues in Los Angeles
# This script will use the Anthropic API to discover venues and save them to a JSON file

echo "=== Los Angeles Venue Discovery Script ==="
echo ""

# Check if ANTHROPIC_API_KEY is set
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "ERROR: ANTHROPIC_API_KEY environment variable is not set"
    echo ""
    echo "Please set your Anthropic API key:"
    echo "  export ANTHROPIC_API_KEY='your-api-key-here'"
    echo ""
    echo "Or run this script with the key:"
    echo "  ANTHROPIC_API_KEY='your-key' ./scripts/run-discover-la-venues.sh"
    echo ""
    exit 1
fi

echo "✓ ANTHROPIC_API_KEY is set"
echo ""
echo "Starting venue discovery..."
echo "This will discover up to 100 venues in Los Angeles and save them to scripts/la-venues.json"
echo ""

# Run the TypeScript script
npx tsx scripts/discover-la-venues-simple.ts

echo ""
echo "Done! Check scripts/la-venues.json for the results."
echo ""
echo "To import the venues to the database, you can:"
echo "1. Use the Supabase dashboard to import the JSON file"
echo "2. Or create a SQL script from the JSON file"
echo "3. Or use the Next.js API endpoint /api/admin/discover-la-venues (requires admin authentication)"
