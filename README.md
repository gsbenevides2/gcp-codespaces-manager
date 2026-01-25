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
CLOUDFLARE_RECORD_NAME="code.gui.dev.br"
SSH_KEY="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC..." // Your public SSH key; used to allow SSH access to the VM (example: the full ssh-rsa string)
JOB_TYPE="codespaces-start" // The action the service will perform; set to "codespaces-start" to start the codespace
```
