# LeitorCódigo_Backend

Este é o repositório do backend da aplicação **LeitorCódigo**, desenvolvido com foco em robustez, segurança e integração com um frontend dedicado.

## 🚀 Tecnologias utilizadas

- **Node.js**: Base do servidor, proporcionando desempenho e escalabilidade.
- **TypeScript**: Tipagem estática para maior segurança e legibilidade do código.
- **Express**: Framework leve e eficiente para construção de APIs RESTful.
- **JWT (JSON Web Token)**: Utilizado para autenticação segura de usuários, garantindo controle de acesso às rotas protegidas.
- **Api da Cosmos Bluesoft**: Utilizada para realizar buscas de produtos com base em código de barras GTIN/EAN.

## 🌐 Deploy

O deploy deste backend foi realizado na plataforma [**Railway**](https://railway.app), garantindo um ambiente de hospedagem moderno, com CI/CD integrado e fácil gerenciamento.

## 🔗 Frontend

O frontend que consome esta API está disponível no repositório:  
👉 [**LeitorCodigo_Frontend**](https://github.com/GustaM0/LeitorCodigo_Frontend)

## Node Version 
v20.15.1
## Npm Version
10.7.0

## Para iniciar em dev
npm run dev

## Build para Produção
1 - Executar 'npm run build'
2 - Copiar arquivos não ts para a pasta como exemplo .env
3 - Executar 'npm start' para iniciar o Backend