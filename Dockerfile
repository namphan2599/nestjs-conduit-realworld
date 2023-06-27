FROM node:18-alpine
WORKDIR /skillshare
COPY . .
RUN npm i
CMD [ "sh", "npm run start:dev" ]
EXPOSE 3000