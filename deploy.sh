#!/usr/bin/env bash

set -eu

PREFIX=s3://wind.cards

# html
aws s3 cp assets/bassoon.html ${PREFIX}/bassoon --content-type 'text/html; charset=utf-8' --cache-control 'max-age=300'

# css & other assets
# we deliberately avoid the `--delete` flag,
# to preserve older fingerprinted assets
aws s3 sync assets $PREFIX --exclude '*' --include '*.css' --cache-control 'max-age=300' --content-type 'text/css; charset=utf-8'
aws s3 sync assets $PREFIX --exclude '*' --include '*.svg' --cache-control 'max-age=300' --content-type 'image/svg+xml'
aws s3 sync assets $PREFIX --exclude '*' --include '*.js' --cache-control 'max-age=300' --content-type 'application/javascript'

# appcache files
aws s3 cp assets/appcache/manifest.html ${PREFIX}/appcache/manifest.html --content-type 'text/html; charset=utf-8' --cache-control 'max-age=300'
aws s3 cp assets/appcache/manifest.appcache ${PREFIX}/appcache/manifest.appcache --content-type 'text/cache-manifest' --cache-control 'max-age=300'

