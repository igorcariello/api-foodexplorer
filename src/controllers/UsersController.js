const knex = require('../database/knex')

const { hash } = require('bcryptjs')

const AppError = require('../utils/AppError')

class UsersController {
  async create(request, response){
    const { name, email, password} = request.body

    const checkEmailExists = await knex('users').where({ email }).first()
   
    if(checkEmailExists){
      throw new AppError('Este e-mail já está sendo utilizado!')
    }

    const hashedPassword = await hash(password, 8)

    const [id] = await knex('users').insert({
      name,
      email,
      password: hashedPassword
    })

    return response.status(201).json()
  }

}

module.exports = UsersController