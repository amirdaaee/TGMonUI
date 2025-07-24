docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli generate \
    -i /local/gen/swagger.json \
    -g typescript-fetch \
    -o /local/gen/client