# based on https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:11

LABEL author="Gus Hahn-Powell"
LABEL description="Odin tutorial"

# Create app directory
WORKDIR /app

# Bundle app source
COPY . .

# Install app dependencies
RUN yarn install --no-optional

# Build, minify, etc.
RUN yarn build

EXPOSE 7777
CMD [ "yarn", "start" ]
