#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -B main
git add -A
git commit -m 'deploy'

# if you are deploying to https://54cheryl.github.io
# git push -f https://github.com/54Cheryl/vite-template.git main

# if you are deploying to https://54cheryl.github.io/vite-template
git push -f https://github.com/54Cheryl/vite-template.git main:gh-pages

cd -