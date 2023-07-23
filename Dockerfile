# Use the Node.js alpine image as the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /usr/app

# Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application files to the container
COPY . .

# Expose the port that the NestJS application listens on (change it to your application's port)
EXPOSE 3000

# Start the NestJS application
CMD ["yarn", "run", "start:prod"]
