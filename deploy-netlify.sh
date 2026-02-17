#!/bin/bash

echo "================================================"
echo "   E1 Chatbot - Netlify Deployment Script"
echo "================================================"
echo ""

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

echo "✓ Netlify CLI is installed"
echo ""

# Navigate to frontend directory
cd frontend || exit

echo "📦 Installing dependencies..."
yarn install

echo ""
echo "🔨 Building frontend..."
yarn build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Deploying to Netlify..."
    echo ""
    echo "Note: Make sure to set REACT_APP_BACKEND_URL in Netlify dashboard"
    echo "      after deploying your backend to Render/Railway"
    echo ""
    
    netlify deploy --prod
    
    echo ""
    echo "================================================"
    echo "   Deployment Complete!"
    echo "================================================"
    echo ""
    echo "Next steps:"
    echo "1. Deploy backend to Render (see DEPLOYMENT.md)"
    echo "2. Update REACT_APP_BACKEND_URL in Netlify dashboard"
    echo "3. Redeploy frontend if needed"
    echo ""
else
    echo ""
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi
