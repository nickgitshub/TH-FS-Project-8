const Sequelize = require('sequelize')
module.exports = (sequelize) => {
	class Book extends Sequelize.Model{}
	Book.init(
		{
			id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
			title: { type: Sequelize.STRING, allowNull: false, validate: { notEmpty: {msg: 'Please provide a title'}}},
			author: { type: Sequelize.STRING, allowNull: false, validate: { notEmpty: {msg: 'Please provide an author'}}},
			genre: { type: Sequelize.STRING, allowNull: true },
			year: { type: Sequelize.STRING, allowNull: true },
		},
		
		{ sequelize } 
	);

	return Book; 
}