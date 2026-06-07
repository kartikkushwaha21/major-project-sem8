# Use Node.js 18 alpine for a small image size
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Expose port 4000
EXPOSE 4000

# Start the application
CMD [ "npm", "start" ]
