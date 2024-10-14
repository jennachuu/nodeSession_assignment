//server.js
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')

const users = [
  {
    user_id: 'test',
    user_password: '1234',
    user_name: 'user for test',
    user_info: 'info for test'
  }
]

const app = express()

app.use(cors({
  origin: ['http://127.0.0.1:5500'],
  methods: ['OPTIONS', 'POST', "GET", "DELETE"],
  credentials: true
}))

app.use(cookieParser())
app.use(express.json())

app.use(session({
  secret: 'session secret',
  resave: false,
  saveUninitialized: false,
  name: 'session_id'
}))

app.post('/', (req, res) => {
  const { userId, userPassword } = req.body
  const userInfo = users.find(el => el.user_id === userId && el.user_password === userPassword)

  if (!userInfo) {
    res.status(401).send('failed to login')
  } else {
    req.session.userId = userInfo.user_id
    res.send("completed to create the session")
  }
})

app.get('/', (req, res) => {
  const userInfo = users.find(el => el.user_id === req.session.userId) 
  return res.json(userInfo)
})

app.delete('/', (req, res) => {
  req.session.destroy()
  res.clearCookie('session_id')
  res.send("completed to delete the session")
})

app.listen(3000, () => console.log('run server'))