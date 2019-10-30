#!/usr/bin/env bash
# settings might need to be changed to reflect rover deploy sh for namespaces
BRAND=dynamite

if [[ ! $CIRCLECI = true ]]; then
    cd ../../../config && source export.sh && cd ../$BRAND/backend/chart
fi

unset CONFIG_VARS

if [[ $CIRCLECI = true ]]; then
    #CALCULATE COPPA API_TARGET_URL
    if [[ -n "$CIRCLE_PULL_REQUEST" ||  $CIRCLE_BRANCH == "master" ]]; then  
      export API_TARGET_URL=https://coppa-${HOST}
    fi
fi

# Load the array with the override values
echo "Export from $ENV_PATH"
while read e || [ -n "$e" ]; do
    # If it's not a comment or empty line, export it
    if [[ ! $e =~ ^# && ! -z $e ]]; then        
        export CONFIG_VARS="$CONFIG_VARS $(echo $e | cut -d= -f1)%=%$(echo $e | cut -d= -f2-)"
        export CONFIG_VARS="$CONFIG_VARS GATSBY_$(echo $e | cut -d= -f1)%=%$(echo $e | cut -d= -f2-)"
    fi
done < "../../../config/$ENV_PATH"

# Export secrets in a .env file, if any
if [[ -f "../.env" ]]; then
    while read e || [ -n "$e" ]; do
        # If it's not a comment or empty line, export it
        if [[ ! $e =~ ^# && ! -z $e ]]; then
            export $e
            echo "Exported $e"
        fi
    done < "../.env"
fi

echo "Setting the hosts..."
# Set HOST correctly
if [[ "$STAGE" =~ (pull|master) ]]; then
    export CONFIG_VARS="$CONFIG_VARS HOST%=%$STAGE.$DOMAIN"
    export CONFIG_VARS="$CONFIG_VARS OTHER_HOST%=%$STAGE.$OTHER_DOMAIN"
    export CONFIG_VARS="$CONFIG_VARS GATSBY_HOST%=%$STAGE.$DOMAIN"
    export CONFIG_VARS="$CONFIG_VARS GATSBY_OTHER_HOST%=%$STAGE.$OTHER_DOMAIN"
    export CONFIG_VARS="$CONFIG_VARS API_TARGET_URL%=%https://$HOST"
fi

# Setting FUNCTIONS_STAGE, used when PRs use master's functions
# It's important to default to empty string, to ensure predictable behaviour with PRs
export CONFIG_VARS="$CONFIG_VARS FUNCTIONS_STAGE%=%${FUNCTIONS_STAGE:-""}"
export CONFIG_VARS="$CONFIG_VARS GATSBY_FUNCTIONS_STAGE%=%${FUNCTIONS_STAGE:-""}"

export CONFIG_VARS=$(echo $CONFIG_VARS | sed -e 's/ /\'$'\n  /g' | sed -e 's/%=%/: /g')

# Substitute environment variables in the template file
envsubst < values.tpl > values.yaml

# Create the Namespace and label for automatic Istio Sidecar Injection
export NAMESPACE=react-$ENVIRONMENT-$BRAND

kubectl label namespace $NAMESPACE app=rover environment=$ENVIRONMENT brand=$BRAND --overwrite
# Upgrade  the Chart if it already exists, install otherwise
helm upgrade --install --force --atomic --recreate-pods --namespace $NAMESPACE coppa-$ENVIRONMENT-$BRAND-$STAGE .
