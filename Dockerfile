# Step 1: Use an official Node.js runtime as a parent image
FROM node:latest

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app 

# Step 3: Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 10: Start Nginx when the container starts
CMD ["npm", "start"]
