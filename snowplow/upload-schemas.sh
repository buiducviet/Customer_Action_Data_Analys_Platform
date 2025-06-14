#!/bin/bash

CONTAINER_NAME=snowplow-iglu-server-1
IGLU_API_URL=http://localhost:8080/api/schemas
API_KEY=bb7b7503-40d3-459c-943a-f8d31a6f5638

# Lấy tất cả file (dù không có .json)
for file in $(find schemas -type f); do
  echo "Uploading: $file"
  docker exec -i "$CONTAINER_NAME" curl -s -X POST "$IGLU_API_URL" \
    -H "apikey: $API_KEY" \
    -H "Content-Type: application/json" \
    -d @- < "$file"
  echo
done
