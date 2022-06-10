const router = require('express').Router()
const feedBackAPI = require('./feedBackAPI')
const userApi = require('./userApi')

router.use('/feedback', feedBackAPI);
router.use('/user', userApi);

module.exports = router