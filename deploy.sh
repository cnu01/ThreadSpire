#!/bin/bash

# Deployment script for Render
echo "Starting deployment for ThreadSpire Backend..."

# Navigate to Backend directory
cd Backend

# Install dependencies
echo "Installing dependencies..."
npm install

# Start the application
echo "Starting application..."
npm start
