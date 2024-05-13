FROM node:latest

# Create app directory
WORKDIR /front_app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

RUN npm run build

CMD [ "npm", "run", "start" ]