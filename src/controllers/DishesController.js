const knex = require('../database/knex')
const DiskStorage = require('../providers/DiskStorage')

const AppError = require('../utils/AppError')

class DishesController {
  async create(request, response){
    const image_dish  = request.file.filename

    const {name, category, ingredients, price, description} = request.body
    const user_id = request.user.id
    
    const ingredientsArray = ingredients.split(", ")
    
    const diskStorage = new DiskStorage()

    const filename = await diskStorage.saveFile(image_dish)

    const [dish_id] = await knex('dishes').insert({
      name, 
      category,
      image_dish: filename,
      user_id,       
      price, 
      description
    })

    const ingredientsInsert = ingredientsArray.map( ingredientName => {
      return {
        name: ingredientName,
        dish_id,
        user_id
      }
    })

    await knex("ingredients").insert(ingredientsInsert)
    
    return response.status(200).json()
  
  }

  async update(request, response){
    const { name, ingredients,category, price, description } = request.body
    const { dish_id } = request.params

    const dish = await knex('dishes').where({ id: dish_id }).first()

    if(!dish){
      throw new AppError('Prato não encontrado!')
    }
    
    const existingIngredients = await knex('ingredients').select('id','name').where('ingredients.dish_id', dish_id)
  
    const newIngredients = ingredients.map( ingredientName => {
      return {
        name: ingredientName,
        dish_id,
        user_id: dish.user_id
      }
    })

    await knex('ingredients').where('ingredients.dish_id', dish_id).del(existingIngredients)
    await knex('ingredients').insert(newIngredients)


    await knex('dishes').where({ id: dish_id}).update({
      name: name ?? dish.name,
      price: price ?? dish.price,
      description: description ?? dish.description,
      category: category ?? dish.category
    })
    return response.status(200).json()
  
  }

  async show(request,response){
    const { id } = request.params

    const dish = await knex('dishes').where({ id }).first()
    const ingredients = await knex('ingredients').where({dish_id: id}).orderBy("id")
  
    return response.json({
      ...dish,
      ingredients
    })
  
  
  }

  async delete(request,response){
    const { id } = request.params

    await knex('dishes').where({id}).delete()

    return response.json()
  }

  async index(request, response){
    const { search } = request.query

    const dishes = await knex("dishes")
    .whereLike("name", `%${search}%`)
    .orderBy("name") 

    const ingredients = await knex("ingredients")
    .whereLike("ingredients.name", `%${search}%`)
    .innerJoin('dishes', "dishes.id","ingredients.dish_id")

    const uniqueId = new Set()

    const uniqueDishesAndIngredients = []

    dishes.forEach(dish => {
      if(!uniqueId.has(dish.id)){
        uniqueId.add(dish.id)
        uniqueDishesAndIngredients.push(dish)
      }
    })

    ingredients.forEach(ingredient => {
      if(!uniqueId.has(ingredient.id)){
        uniqueId.add(ingredient.id)
        uniqueDishesAndIngredients.push(ingredient)
      }
    })
      return response.json(uniqueDishesAndIngredients)
  }


}



module.exports = DishesController