# Dockerfile extending the generic nodejs image
FROM node:carbon 

WORKDIR /usr/src/app

# Install Dependencies
COPY package.json yarn.lock ./

RUN apt-get update && apt-get install yarn -y

COPY . .

# RUN yarn global add merge-yaml-cli && yarn add https://github.com/felexx90/coppa && yarn
RUN yarn global add merge-yaml-cli && yarn

RUN merge-yaml -i ./serverless-checkout-2.yml ./serverless-common.yml ./serverless-checkout-1.yml -o serverless.yml

# Run the server
CMD node ./cli.js start --service=false --prefix=$BRAND_CODE-$STAGE

# The Docker image will configure the document root according to this
# environment variable.
ENV DOCUMENT_ROOT /app
