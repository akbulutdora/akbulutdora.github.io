#!/bin/bash
# Build the book
mdbook build
# Switch to the main branch
# git checkout main
# Copy the contents of the book directory to the root directory
# cd ..
cp -r ./blog/book/* .
# Add all new files
git add .
# Commit the changes
git commit -m "Update blog"
# Push the changes to GitHub
git push origin main
