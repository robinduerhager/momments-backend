FROM node:18
WORKDIR /app
COPY . .
# COPY package.json package-lock.json ./
RUN npm install --production
RUN npm run build
CMD ["node", "dist/index.js"]