const { Router } = require("express")
const multer = require('multer')
const uploadConfig = require('../configs/upload')

const ensureAuthenticated = require('../middlewares/ensureAuthenticated')
const DishesController  = require('../controllers/DishesController')
const ImageDishController = require("../controllers/ImageDishController")

const dishesRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const dishesController = new DishesController()
const imageDishController = new ImageDishController()

dishesRoutes.use(ensureAuthenticated)

dishesRoutes.post('/', upload.single("image_dish"), dishesController.create)
dishesRoutes.put('/:dish_id', dishesController.update)
dishesRoutes.get("/:id", dishesController.show)
dishesRoutes.get("/", dishesController.index)
dishesRoutes.delete("/:id", dishesController.delete)

dishesRoutes.patch('/imageDish/:dish_id', upload.single("imageDish"), imageDishController.update)


module.exports = dishesRoutes
