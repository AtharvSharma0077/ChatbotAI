#!/bin/bash

echo "=========================================="
echo "  Netlify Deployment Troubleshooting"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "netlify.toml" ]; then
    echo "❌ Error: netlify.toml not found!"
    echo "   Make sure you're in the project root directory."
    exit 1
fi

echo "✓ Found netlify.toml"

# Check frontend directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: frontend directory not found!"
    exit 1
fi

echo "✓ Found frontend directory"

# Check package.json
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: frontend/package.json not found!"
    exit 1
fi

echo "✓ Found frontend/package.json"

# Test build locally
echo ""
echo "🔨 Testing build locally..."
cd frontend || exit

echo "📦 Installing dependencies..."
yarn install

if [ $? -ne 0 ]; then
    echo "❌ Dependency installation failed!"
    exit 1
fi

echo "✓ Dependencies installed"

echo ""
echo "🏗️  Building..."
yarn build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "Build output directory: frontend/build"
    echo ""
    ls -la build | head -n 10
    echo ""
    echo "=========================================="
    echo "  Your app is ready to deploy!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Push to GitHub: git push origin main"
    echo "2. Netlify will auto-deploy"
    echo ""
    echo "Or deploy manually:"
    echo "  netlify deploy --prod"
    echo ""
else
    echo ""
    echo "❌ Build failed!"
    echo ""
    echo "Common fixes:"
    echo "1. Check if all dependencies are in package.json"
    echo "2. Make sure REACT_APP_BACKEND_URL is set"
    echo "3. Check for TypeScript/ESLint errors"
    echo ""
    exit 1
fi