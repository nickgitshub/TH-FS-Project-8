const Sequelize = require('sequelize')


const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: 'library.db',
	logging: false //disabling the console logging
});

const db = {
	sequelize,
	Sequelize,
	models: {}
}

db.models.Book = require('./models/book.js')(sequelize);

module.exports = db; 