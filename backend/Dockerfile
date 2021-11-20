FROM node:16
ENV PORT=80
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
WORKDIR /app/build
EXPOSE 80
CMD [ "node", "index.js" ]