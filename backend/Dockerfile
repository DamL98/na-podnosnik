# Alpine zajmuje ok. 5MB bazy
FROM node:20-alpine

# folder roboczy wewnątrz kontenera
WORKDIR /app

# kopiujemy pliki zależności
COPY package*.json ./
RUN npm install

# kopiujemy resztę kodu źródłowego
COPY . .

# info na jakim porcie działa backend
EXPOSE 5000

# uruchomienie apki
CMD ["npm", "start"]