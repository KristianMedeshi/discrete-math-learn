const { Router } = require('express');
const authRoutes = require('./authRoutes');

const router = Router();

router.use('/users', authRoutes);

module.exports = router;
