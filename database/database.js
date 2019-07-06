// const Knex = require('knex');

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS
  }
});

const bookshelf = require('bookshelf')(knex);
bookshelf.plugin('pagination');

module.exports = bookshelf;
