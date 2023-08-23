const {Router} = require('express')
const products = require('./products')
const carts = require('./carts')

const router = Router()

router.use('/products', products)
router.use('/carts', carts)


module.exports = router