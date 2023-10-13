const { Router } = require('express')
const authController = require('../constrollers/authController')

const router = Router()

router.post('/signup', authController.signup)
router.post('/signin', authController.signin)

module.exports = router