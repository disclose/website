# IndexNow Implementation for disclose.io

This directory contains the IndexNow API configuration for immediate content indexing.

## Files

- `indexnow.json` - IndexNow API configuration with key
- `../bfe1688231124a61b49b37c0b462e9d9.txt` - API key verification file

## Usage

IndexNow allows immediate notification to search engines when content is updated, rather than waiting for crawlers. Supported by Bing, Yandex, and increasingly other search engines.

**API Key**: `bfe1688231124a61b49b37c0b462e9d9`

## Implementation

After deployment, content updates can be submitted via:

```bash
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d '{
    "host": "disclose.io",
    "key": "bfe1688231124a61b49b37c0b462e9d9",
    "urlList": ["https://disclose.io/updated-page"]
  }'
```

## Verification

The configuration will be accessible at:
- https://disclose.io/.well-known/indexnow.json
- https://disclose.io/bfe1688231124a61b49b37c0b462e9d9.txt

Both files are required per IndexNow specification.