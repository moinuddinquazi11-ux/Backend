# Use Node.js 20 Alpine with necessary build tools
FROM node:20-alpine

# Install Python and build tools required for some Node.js modules
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application
COPY . .

# Expose the port
# EXPOSE 7000

# Start the application
CMD ["npm", "start"]
