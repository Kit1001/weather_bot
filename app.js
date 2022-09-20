const express = require('express');
const axios = require("axios");
const app = express();
const https = require('https');
const fs = require('fs');
const FormData = require('form-data')
const {execSync} = require('child_process');
require('dotenv').config()


const PORT = 8443;
const TOKEN = process.env.TOKEN;
const WEATHER_KEY = process.env.WEATHER_KEY;
const HOST = process.env.HOST;

// создаем самоподписанный SSL сертификат для работы по https
execSync(`openssl req -newkey rsa:2048 -sha256 -nodes -keyout YOURPRIVATE.key -x509 -days 365 -out YOURPUBLIC.pem -subj "/C=RU/ST=Example/L=Example/O=None/CN=${HOST}"`)

const options = {
  key: fs.readFileSync('./YOURPRIVATE.key'),
  cert: fs.readFileSync('./YOURPUBLIC.pem')
};

// регистрируем наш вебхук в api телеграмма
setWebhook()

// используем json middleware из express'a
app.use(express.json());


// задаем обработчик запросов
app.post('/', (req, res) => {
  console.log(req.body)
  if (req.body.hasOwnProperty('message')) {
    handleMessage(req.body.message).then(r =>
      res.send(r)
    ).catch(err => console.log(err))
  } else {
    res.send('')
  }
});


// запускаем https сервер
const server = https.createServer(options, app)
server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})





async function handleMessage(message) {
  return new Promise((resolve) => {
    if (message.text === '/start') {
      const response = {
        method: 'sendMessage',
        chat_id: message.chat.id,
        text: 'Здравствуйте! Введите название города и я расскажу вам какая там погода.'
      };
      resolve(response);
    } else {
      getWeather(message.text)
        .then(r => {
          const response = {
            method: 'sendMessage', chat_id: message.chat.id, text: `Температура: ${r.temp} °C
${r.description[0].toUpperCase() + r.description.slice(1)}
Ветер: ${r.wind} м\\с`
          };
          resolve(response);
        })
        .catch(err => {
          console.log(err);
          const response = {
            method: 'sendMessage',
            chat_id: message.chat.id,
            text: 'Неизвестный город'
          };
          resolve(response);
        })
    }
  })
}

async function getWeather(city) {
  return new Promise((resolve, reject) => {
    const cityEnc = encodeURI(city)
    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cityEnc}&APPID=${WEATHER_KEY}&lang=RU&units=metric`)
      .then((r) => {
        // console.log(r.data)
        const result = {
          temp: parseInt(r.data.main.temp),
          description: r.data.weather[0].description,
          wind: parseInt(r.data.wind.speed)
        }
        resolve(result)
      })
      .catch(err => reject(new Error(err)))
  })
}


function setWebhook() {
  const formData = new FormData();
  formData.append('url', `https://${HOST}:${PORT}`);
  formData.append('certificate', fs.createReadStream("./YOURPUBLIC.pem"));
  axios.post(`https://api.telegram.org/bot${TOKEN}/setWebhook`, formData).then(r => console.log(r.data));
}