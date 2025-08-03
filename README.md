# GCP Codespaces Manager

## Setup

```bash
./setup.sh
```

## Run

```bash
bun run dev
```

## Setup Environment Variables

```bash
GOOGLE_APPLICATION_CREDENTIALS="./gcp.json" // Get from GCP Console > IAM & Admin > Service Accounts > Create Service Account > Create Key > JSON
CLOUDFLARE_API_TOKEN="JajYUV_yts_...F9" // Get from Cloudflare Profile > API Tokens
PROJECT_ID="gui-dev-br"
CLOUDFLARE_ZONE_ID="7b2ba0ff...f6f20b828" // Get from Cloudflare DNS Page Home
CLOUDFLARE_RECORD_ID="219a99ecf29aee44c2b986f297e237b7" // See the record id in change record page see the traffic on the network tab
CLOUDFLARE_RECORD_NAME="code.gui.dev.br"
```
