# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /src

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Copy the .env file
COPY .env .env

# Build the TypeScript code
RUN npm run build

# Set the working directory to the built files
WORKDIR /dist

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["node", "dist/index.js"]
