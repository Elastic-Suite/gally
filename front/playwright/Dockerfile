# Utiliser l'image Node 20 comme base
FROM node:18-bookworm

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Installer les navigateurs Playwright requis
RUN npx playwright install --with-deps

# Copier le reste de l'application
COPY . .

# Commande pour exécuter les tests Playwright
CMD ["npx", "playwright", "test"]