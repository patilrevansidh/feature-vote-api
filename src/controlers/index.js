var router = require('express').Router();


router.use('/auth',require('./auth/login'));
router.use('/features',require('./features/index'));
router.use('/comments',require('./comments/index'));
router.use('/users',require('./users/index'));
router.use('/groups',require('./groups/index'));


module.exports = router