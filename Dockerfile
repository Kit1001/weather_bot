FROM node

COPY . .
RUN "node install"

CMD ["node", "app.js"]
