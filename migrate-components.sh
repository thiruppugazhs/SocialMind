#!/bin/bash

# Copy original components to frontend
echo "📋 Copying components to frontend..."

mkdir -p frontend/components

# Copy all component files
cp components/*.tsx frontend/components/

# Update imports in frontend components to use apiService
echo "🔄 Updating imports..."

# Pattern to replace geminiService with apiService
find frontend/components -name "*.tsx" -type f -exec sed -i \
  "s|from '../services/geminiService'|from '../services/apiService'|g" {} +

echo "✅ Components copied and imports updated!"
echo ""
echo "📝 To complete the migration:"
echo "  1. Review each component in frontend/components/"
echo "  2. Remove mock data (mockData, mockFollowers, etc.)"
echo "  3. Update components to fetch real data from backend APIs"
echo "  4. Update the frontend App.tsx to use actual components"
