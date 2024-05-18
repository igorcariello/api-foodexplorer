const { text } = require('express')
const knex = require ('knex')

exports.up = knex => knex.schema.createTable("dishes", table => {
table.increments('id')

table.text('name').notNullable()

table
.enum("category", ['Refeição', 'Prato Principal', 'Sobremesas'], { userNative: true, enumName: "categories"})
.notNullable().default('Refeição')

table.integer('user_id').references('id').inTable('users')

table.text('image_dish').notNullable()

table.float('price').unsigned().notNullable()

table.text('description')

table.timestamp('created_at').default(knex.fn.now())
table.timestamp('updated_at').default(knex.fn.now())


})

exports.down = knex => knex.schema.dropTable('dishes')