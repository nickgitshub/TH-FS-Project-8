
//set up express
const express = require('express')
const app = express();

//middleware needed to extract data from Requests
app.use(express.urlencoded())

//set up sequelize
const Sequelize = require('sequelize');
const { Op } = require('sequelize');


const db = require('./db');
const { Book } = db.models;


//asyncHandler
//sends error if network connection cannot be established
function asyncHandler(cb){
	return async (req, res, next)=>{
		try{
			await cb(req, res, next);
		} catch(err){
			console.log('-------------- \n Async Error \n --------------')
			err.status = 500
			next(err);
		}
	}
}

//modifies the arrays returned from queries to add classes to elements
//prepares elements for pagination by client side JS
function modifyQuery(queryOutput){
	let jsonResults = queryOutput.map(result => result.toJSON())
	let modResults = []
	let pageArray = []

	page = 1
	while (jsonResults.length > 0) {

		n=0
		while(n < 10 && jsonResults.length > 0){
			let result = jsonResults.shift()
			result.pageClass = "page " + page
			modResults.push(result)
			n+=1
		}
		pageArray.push(page)
		page += 1;
	}
	return[modResults, pageArray]
}

//set pug as the view engine
app.set('view engine', 'pug')

//set route to css files as static
app.use('/static', express.static('public'));

//redirects home route to the books page
app.get('/', asyncHandler(async(req, res) => {
	return res.redirect('/books');
}))

//creates an index page of 'books'
app.get('/books', asyncHandler(async(req, res) => {
	await db.sequelize.sync();

	const bookResults = await Book.findAll();
	const [modResults, pageArray] = modifyQuery(bookResults)

	return res.render('index', { books: modResults, pages: pageArray});
}))


//an endpoint that can be used to search for books
app.post('/books/search', asyncHandler(async(req, res) => {

	//create a JSON object containing title, author, genre, and year
	await db.sequelize.sync();
	const searchResults = await Book.findAll({
		attributes: ['id', 'title', 'author', 'genre', 'year']
	});

	//collect search input
	const searchInput = req.body.search.toLowerCase()

	//function that will check for search matches within title, author, genre, and year
	//returns a boolean stating whether a match was found
	function matchCheck(attribute){
		if (typeof attribute === "string"){
			return attribute.toLowerCase().search(searchInput)>-1
		} else if (typeof attribute === "number") {
			return attribute.toString().search(searchInput)>-1
		} else {
			return false;
		}	
	}

	//uses the matchCheck to create an array of functions that match the search
	let matchArray = []
	searchResults.forEach(book=> {
		if (matchCheck(book.title)||matchCheck(book.author)||matchCheck(book.genre)||matchCheck(book.year)){
			matchArray.push(book)
		}
	})

	const [modResults, pageArray] = modifyQuery(matchArray)

	return res.render('index', { books: modResults, pages: pageArray});
}))

//enables a reset of the book index after a search
app.post('/books/reset', (req, res) => {
	res.redirect('/books')
})

//page to create new books
app.get('/books/new', (req, res) => {
	return res.render('new-book');
})

//posting to page for new books
app.post('/books/new', asyncHandler(async(req, res) => {
	await db.sequelize.sync();
	try{
		const newBook = await Book.create({
		title: req.body.title,
		author: req.body.author,
		genre: req.body.genre,
		year: req.body.year
		})
		return res.render('new-book');
	} catch(error){
		if(error.name === "SequelizeValidationError") {
			return res.render('new-book', {errors: "Author and Title are required"});
		} else{
			throw error; 
		}
	}	
}))


//opening a particular book
app.get('/books/:id', asyncHandler(async(req, res) => {
	await db.sequelize.sync();
	const retrievedBook= await Book.findByPk(req.params.id)
	if(retrievedBook){
		return res.render('update-book', { book: retrievedBook });
	} else {
	    res.render('page-not-found');
	}
	
}))

//updating a particular book
app.post('/books/:id', asyncHandler(async(req, res) => {
	await db.sequelize.sync();
	const retrievedBook = await Book.findByPk(req.params.id)
	if(retrievedBook){
		try{
			await retrievedBook.update({
				title: req.body.title,
				author: req.body.author,
				genre: req.body.genre,
				year: req.body.year
			})
			res.redirect('/books/')
		} catch (error){
			if(error.name === "SequelizeValidationError") {
				return res.render('update-book', {book: retrievedBook, errors: "Author and Title are required"});
			} else{
				throw error; 
			}
		}
	} else {
		res.render('page-not-found');
	}
	
	
}))

//.deleting a particular book
app.post('/books/:id/delete', asyncHandler(async(req, res) => {
	await db.sequelize.sync();
	const retrievedBook = await Book.findByPk(req.params.id)

	if(retrievedBook){
		await retrievedBook.destroy()
		res.redirect('/books');
	} else {
	    res.render('page-not-found');
	}
	
}))


//404 error being created if no route is found
app.use((req,res, next) => {
	const err = new Error('Route Not Found');
	err.status = 404;
	next(err);
})

//renders errors if any are caught on page
app.use((err, req, res, next) => {
	console.log(err)
	res.status(err.status);
	res.locals.error = err;
	if(err.status === 404){
		res.render('page-not-found');
	} else {
		res.render('error');
	}
})


app.listen(3000, console.log("App now running on Port 3000"))