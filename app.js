const express = require('express')
const axios = require("axios");
const app = express()
const port = 3000


app.use(express.json())
//
app.post('/', (req, res) => {
  console.log(req.body.message)
  res.send({
      method: 'sendMessage',
      chat_id: req.body.message.chat.id,
      text: req.body.message.text
    },
  )
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})