FROM mcr.microsoft.com/playwright:v1.43.0-jammy
WORKDIR /scraper
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "src/index.js"]
