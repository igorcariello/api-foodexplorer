const { text } = require('express')
const knex = require ('knex')

exports.up = knex => knex.schema.createTable("ingredients", table => {
  table.increments('id')
  table.text('name')
  
  table.integer('dish_id').references('id').inTable('dishes').onDelete('CASCADE')
  table.integer('user_id').references('id').inTable('users')

})

exports.down = knex => knex.schema.dropTable('ingredients')