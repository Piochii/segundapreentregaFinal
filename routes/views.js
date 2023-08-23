const {Router} = require('express')
const ProductManager = require('../controllers/productsManager')
const {dirname} = require('path')
const uploader = require('../utils')


const router = Router()

const productsList = new ProductManager(`${dirname(__dirname)}/db/products.json`)

router.get('/', async (req, res) => {
    const limit = req.query.limit
    const products = await productsList.getProducts(limit)
    const objeto = {
        styled: "main.css",
        title: "PRODUCTS LIST",
        products
    }
    res.render('home', objeto)
})

router.get('/realTimeProducts', async (req, res) => {
    const limit = req.query.limit
    const products = await productsList.getProducts(limit)
    const data = {
        style: "styleProdRt.css",
        title: "PRODUCTS LIST",
        products
    }
    res.render('realTimeProducts', data)
})
router.post('/realTimeProducts', uploader.array('thumbnail', 10), async (req, res) => {
    const imgPaths = req.files.map(file => file.path)
    const product = req.body
    await productsList.addProducts(product, imgPaths)
    const products = await productsList.getProducts()
    const data = {
        style: "styleProdRt.css",
        title: "PRODUCTS LIST",
        products
    }
    res.status(200).render('realTimeProducts', data)
})
module.exports = router