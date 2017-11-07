#!/usr/bin/env bash

set -eu

PREFIX=s3://wind.cards
CACHE_SHORT='max-age=300'
CACHE_FOREVER='max-age=31536000'

# html
aws s3 cp assets/bassoon.html ${PREFIX}/bassoon --content-type 'text/html; charset=utf-8' --cache-control ${CACHE_SHORT}

# css
# for some reason, the default webpack css approach (ExtractTextWebpackPlugin)
# doesn't fingerprint the CSS URLs, so we have to use shorter caching

aws s3 sync assets $PREFIX --exclude '*' --include '*.css' --cache-control ${CACHE_SHORT} --content-type 'text/css; charset=utf-8'
aws s3 sync assets $PREFIX --exclude '*' --include '*.css.map' --cache-control ${CACHE_SHORT} --content-type 'text/css; charset=utf-8'

# fingerprinted assets - svg and js
# these can be far-future cached
# for all `aws s3 sync` commands, we deliberately avoid the `--delete`
# flag, to preserve older fingerprinted assets
aws s3 sync assets $PREFIX --exclude '*' --include '*.svg' --cache-control ${CACHE_FOREVER} --content-type 'image/svg+xml'
# need to exclude sw.js, not fingerprinted
aws s3 sync assets $PREFIX --exclude '*' --include 'main.*.js' --cache-control ${CACHE_FOREVER} --content-type 'application/javascript'
aws s3 sync assets $PREFIX --exclude '*' --include 'main.*.js.map' --cache-control ${CACHE_FOREVER}

# appcache files
aws s3 sync assets $PREFIX --exclude '*' --include 'sw.js' --cache-control ${CACHE_SHORT} --content-type 'application/javascript'
aws s3 cp assets/appcache/manifest.html ${PREFIX}/appcache/manifest.html --content-type 'text/html; charset=utf-8' --cache-control ${CACHE_SHORT}
aws s3 cp assets/appcache/manifest.appcache ${PREFIX}/appcache/manifest.appcache --content-type 'text/cache-manifest' --cache-control ${CACHE_SHORT}

