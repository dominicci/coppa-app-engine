# Default values for rover.
# This is a YAML-formatted file.
# Declare variables to be passed into your templates.

env: ${ENVIRONMENT}
istioEnv: ${ISTIO_INGRESS_ENVIRONMENT}
stage: ${STAGE}
functionsStage: ${GATSBY_FUNCTIONS_STAGE}
domain: ${DOMAIN}
host: ${HOST}
otherHost: ${OTHER_HOST}
brand: ${BRAND}
brandCode: ${BRAND_CODE}
gcloudProjectId: ${GCLOUD_PROJECT_ID}
firestoreServiceKey: ${FIRESTORE_SERVICE_KEY}
inventoryServiceKey: ${INVENTORY_SERVICE_KEY}
lokalizeApiKey: ${LOKALISE_API_KEY}
minReplicas: ${MIN_REPLICAS}
maxReplicas: ${MAX_REPLICAS}
resourcesCpu: ${RESOURCES_CPU}
resourcesMemory: ${RESOURCES_MEMORY}
nodepoolName: ${NODEPOOL_NAME}
cloudflareApiEmail: ${CLOUDFLARE_API_EMAIL}
cloudflareApiKey: ${CLOUDFLARE_API_KEY}
newrelicApiKey: ${NEW_RELIC_API_KEY}
githubWebhookSecret: ${GITHUB_WEBHOOK_SECRET}

config:
  $CONFIG_VARS