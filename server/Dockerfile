FROM node:17
# Create app directory
WORKDIR /server
COPY package*.json ./
RUN npm install
#RUN npm ci --only=production

COPY . .

EXPOSE 5000
CMD [ "npm","start" ]