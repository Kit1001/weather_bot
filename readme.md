### Описание
  Бот отправляет пользователю данные о погоде в ответ на сообщение с указанием города.  
Используются погодные данные OpenWeatherMap


### Стек
Node.js, Express.js


### Запуск

1. Нужно указать в файле .env или в переменных окружения следующие данные:  
- TOKEN=токен бота телеграмм  
- WEATHER_KEY=ключ api OpenWeatherMap  
- HOST=ip-адрес сервера
2. Для запуска потребуется гит и докер  
`sudo apt install docker.io git`
3. Копируем репозиторий  
`git clone https://github.com/Kit1001/weather_bot.git`
4. Переходим в рабочую папку  
`cd weather_bot`
5. Создаем образ для докера  
`sudo docker build . -t weatherbot`
6. Создаем и запускаем контейнер из образа  
`sudo docker run -d -p 8443:8443 weatherbot`