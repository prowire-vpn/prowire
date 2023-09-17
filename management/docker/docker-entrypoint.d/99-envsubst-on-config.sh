#!/bin/sh

envsubst < /usr/share/nginx/html/config.json.tmpl > /usr/share/nginx/html/config.json
