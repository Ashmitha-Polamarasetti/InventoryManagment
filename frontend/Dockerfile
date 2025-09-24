# Use Node 20 Alpine image for small size
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the React app
RUN npm run build

# Install serve to serve the build folder
RUN npm install -g serve

# Expose port 3000 for frontend
EXPOSE 3000

# Start the app
CMD ["serve", "-s", "build", "-l", "3000"]
