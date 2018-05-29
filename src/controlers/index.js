var router = require('express').Router();

router.use('/auth',require('./auth/login'));

router.use('/features',require('./features/index'));

module.exports = router