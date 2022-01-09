#!/bin/bash

set -e

node build.mjs
cp public/data.json dist/data.json

git add public/data.json
git commit -m "(automated) rebuilt database"
git push

