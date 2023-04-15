FROM node:19-alpine AS build

WORKDIR /opt/app

COPY ./package*.json .

RUN npm install

COPY . .

RUN ["npm", "run", "build"]


FROM nginx:alpine

COPY --from=build /opt/app/build /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]