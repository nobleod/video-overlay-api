FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

# Expose the port Railway will provide (usually 3000)
EXPOSE 3000

# Start the app, Railway sets PORT env variable
CMD ["node", "index.js"]
