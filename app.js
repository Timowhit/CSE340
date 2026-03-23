const express = require('express')
const path = require('path')
require('dotenv').config()

const indexRouter = require('./routes/index')
const inventoryRouter = require('./routes/inventoryRoute')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/', indexRouter)
app.use('/inv', inventoryRouter)

// ---- 404 Handler ----
app.use((req, res, next) => {
  const err = new Error('Page Not Found')
  err.status = 404
  next(err)
})

// ---- Error Handling Middleware (Task 2 & 3) ----
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'An unexpected error occurred.'
  console.error(`Error ${status}: ${message}`)
  res.status(status).render('errors/error', {
    title: status === 404 ? '404 – Page Not Found' : '500 – Server Error',
    message,
    status,
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

module.exports = app