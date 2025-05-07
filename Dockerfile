FROM node:20.15.1

WORKDIR /home/leitorproduto_cb_backend

# Copia arquivos primeiro (package e env)
COPY package*.json ./
COPY .env .env

# Adiciona node_modules ao PATH
ENV PATH=/home/leitorproduto_cb_backend/node_modules/.bin:$PATH

RUN npm install

# Copia todo o restante da aplicação
COPY . .

# Compilar o typeScript
RUN npx tsc

# Copia o arquivo db.json manualmente para o build (nao sera necessario apos implementar ORM)
RUN mkdir -p dist/server/assets/db && cp server/src/assets/db/db.json dist/server/assets/db/db.json

EXPOSE 3002
CMD ["node", "dist/server/server.js"]