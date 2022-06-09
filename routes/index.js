const router = require('express').Router()
const feedback = require('./feedBackAPI')
const userApi = require('./userApi')

router.use('/feedback', feedback);
router.use('/user', userApi);

module.exports = router