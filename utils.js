const multer = require('multer')

//Configuramos la ubicacion donde se guardaran los archivos subidos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/public/uploads`)
  },//Configuramos el nombre de los archivos subidos
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
//guardamos el objeto de configuracion en una constante y ademas capturamos posibles errores
const uploader = multer({
  storage,
  onError: (err, next) => {
      console.log(err)
      next()
  }
})

module.exports = uploader