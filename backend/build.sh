# Required ENVs
: ${STAGE:?Build argument needs to be set and non-empty.}
: ${GCLOUD_PROJECT_ID:?Build argument needs to be set and non-empty.}

BRAND=dynamite

# Run /config/export.sh before if locally
if [[ ! $CIRCLECI = true ]]; then
    cd ../../config && source export.sh && cd ../$BRAND/backend
fi

# Build the docker image
docker build --build-arg BRAND -t coppa-$BRAND:$STAGE .

# Tag the image
docker tag coppa-$BRAND:$STAGE gcr.io/$GCLOUD_PROJECT_ID/coppa-$BRAND:$STAGE

# Push image to Google Cloud Registry
docker push gcr.io/$GCLOUD_PROJECT_ID/coppa-$BRAND:$STAGE
