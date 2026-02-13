#!/bin/bash

# SocialMind Backend & Frontend Setup Script

echo "🚀 Setting up SocialMind Project..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Step 2: Create .env file
echo "⚙️  Creating .env file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your API keys."
else
    echo "⚠️  .env file already exists."
fi

# Step 3: Prompt user to configure
echo ""
echo "📋 Configuration Checklist:"
echo "  1. Edit .env file with:"
echo "     - GEMINI_API_KEY (from console.cloud.google.com)"
echo "     - META_CLIENT_ID & META_CLIENT_SECRET (from facebook.com/developers)"
echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
