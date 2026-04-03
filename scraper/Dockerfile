FROM mcr.microsoft.com/playwright:v1.59.1-jammy
WORKDIR /scraper
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "src/index.js"]
