#!/usr/bin/env bash

# html
aws s3 cp redo.html s3://wind.cards/bassoon --content-type 'text/html; charset=utf-8' --cache-control 'max-age=300'
aws s3 cp oboe.html s3://wind.cards/oboe --cache-control 'max-age=300' --content-type 'text/html; charset=utf-8'

# css & other assets
aws s3 sync css s3://wind.cards/css --exclude '*' --include '*.css' --cache-control 'max-age=300' --content-type 'text/css; charset=utf-8'
aws s3 sync . s3://wind.cards/ --exclude '*' --include '*.svg' --cache-control 'max-age=300' --content-type 'image/svg+xml'
aws s3 sync js s3://wind.cards/js --exclude '*' --include '*.js' --cache-control 'max-age=300' --content-type 'application/javascript'
