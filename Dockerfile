# Use an official Node.js runtime as the base image
FROM node:18.16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which your application will run
EXPOSE 3000

# Start the application

CMD npx prisma generate --schema=./src/prisma/schema.prisma && node ./src/index.js
