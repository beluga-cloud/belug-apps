FROM node:19.1.0-alpine3.16

USER node

COPY --chown=node:node mockoon.data.json package.json yarn.lock /opt/truenas-api-mock/
WORKDIR /opt/truenas-api-mock

RUN yarn install \
    && yarn cache clean
ENV PATH="${PATH}:/opt/truenas-api-mock/node_modules/.bin"

EXPOSE 3000
ENTRYPOINT [ "mockoon-cli", "start", "--data=/opt/truenas-api-mock/mockoon.data.json", "--daemon-off" ]
