const knex = require('../database/knex')

const DiskStorage = require('../providers/DiskStorage')
const AppError = require('../utils/AppError')

class ImageDishController {
  async update(request, response){
    const { dish_id } = request.params
    const imageDish = request.file.filename

    const diskStorage = new DiskStorage()

    const dish = await knex("dishes").where({id: dish_id}).first()
    

    if(!dish){
      throw new AppError('Prato não encontrado !')
    }

    if(dish.image_dish){
      await diskStorage.deleteFile(dish.image_dish)
    }

    const filename = await diskStorage.saveFile(imageDish)

    dish.image_dish = filename

    await knex('dishes').where({ id: dish_id}).update({ image_dish: filename})

    return response.json(dish)
  
  }
  
}


module.exports = ImageDishController