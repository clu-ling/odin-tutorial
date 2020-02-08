# based on https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:11

LABEL author="Gus Hahn-Powell"
LABEL description="Odin UI"

# Create app directory
WORKDIR /app

# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

# Install app dependencies
RUN yarn install

# Build, minify, etc.
RUN yarn run build

EXPOSE 7777
CMD [ "yarn", "run", "start" ]
