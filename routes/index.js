const { Router } = require('express')
const authRoutes = require('./authRoutes')

const router = Router()

router.get('/test', (req, res) => {
  res.json({message: 'Response'})
})

router.use('/users', authRoutes)

module.exports = router