FROM mcr.microsoft.com/playwright:v1.43.0-jammy
WORKDIR /scraper
COPY package*.json ./
RUN npm ci && npm install drizzle-orm postgres
COPY . .
CMD ["node", "--experimental-specifier-resolution=node", "src/index.js"]
