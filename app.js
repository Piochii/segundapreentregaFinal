const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const handlebars = require('express-handlebars')
const routers = require('./routes/index')
const viewsRouter = require('./routes/views')
const ProductManager = require('./controllers/productsManager')

const app = express()
const PORT = 8080

const httpServer = http.createServer(app)
const productsList = new ProductManager(`${__dirname}/db/products.json`)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname +'/views')
app.set('view engine', 'handlebars')

app.use('/static', express.static(`${__dirname}/public`))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const io = new Server(httpServer)
httpServer.listen(PORT, () => {
    console.log(`Listening app port ${PORT}`)
})

app.use('/api', routers)
app.use("/", viewsRouter)

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado', socket.id)
    socket.on('client:productDelete', async (pid, cid) => {
        const id = await productsList.getProductById(parseInt(pid.id))
        if(id) {
        await productsList.deleteById(parseInt( pid.id ))
        const data = await productsList.getProducts()
        return io.emit('newList', data)
        }
        const dataError = {status: "error", message: "Product not found"}
        return socket.emit('newList', dataError)
    })
    socket.on('client:newProduct', async data => {
        console.log(data.thumbnail)
        const imgPaths = data.thumbnail
        const productAdd = await productsList.addProducts(data, imgPaths)
        console.log(productAdd);
        if(productAdd.status === 'error'){
            let errorMess = productAdd.message
            socket.emit('server:producAdd', {status:'error', errorMess})
        }
        const newData = await productsList.getProducts()
        return io.emit('server:productAdd', newData)
    })
})