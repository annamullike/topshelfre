// NodeJS (Express)

const express = require('express');
const app = express();
app.use(express.json());
const request = require('supertest');

const { describe} = require('node:test');
const test = require('node:test');

let books = [{id: 1, title: 'Book 1', author: 'Author 1', published_date: '2022-01-01', price: 9.99}];


app.get('/books', (req, res) => {
	try {
		return res.status(200).json({books: books});
	} catch(error) {
		return res.status(500).json({error: "Error in get request: ", error});
	}

});

app.get('/books/:id', (req, res) => {
	try {
		const id = req.params.id;
		res.locals.book = books.find(book => book.id == id);
		if (res.locals.book) {
			return res.status(200).json({book: res.locals.book});
		} else {
			return  res.status(500).json({error: "Cannot find book"});
		}

	} catch(error) {
		return res.status(500).json({error: "Error in get request: ", error});
	}
	

});

app.post('/books', (req, res) => {
	const {id, title, author, published_date, price} = req.body;
	try {
		 if (id && title && author && published_date && price) {
			const book = {id, title, author, published_date, price};
			books.push(book);
			return res.status(201).send("success");
		 } else {
			return res.status(500).json({error: "Invalid body"});
		 }
		
	} catch(error) {
		return res.status(500).json({error: "Error in post request: ", error});
	}
});

app.put('/books/:id', (req, res) => {
	const idParam= req.params.id;
	const {id, title, author, published_date, price} = req.body;
	try {
		const isIdValid = books.find(book => book.id ==idParam);
		if (isIdValid) {
			const book = {id, title, author, published_date, price};
			res.locals.bookId = books.findIndex(book => book.id == idParam);
			books[res.locals.bookId] = book;
			return res.status(200).send("success");
		} else {
			return res.status(500).json({error: "Cannot find book to update"});
		}
		

	} catch(error) {
		return res.status(500).json({error: "Error in put request: ", error});
	}
});

app.delete('/books/:id', (req, res) => {
	try {
		const id = req.params.id;
		const isIdValid = books.find(book => book.id == id);
		if (isIdValid) {
			books = books.filter(book => book.id != id);
			return res.status(200).json({book: books});
		}
		else {
			return res.status(500).json({error: "Cannot find book to delete"});
		}
		
	} catch(error) {
		return res.status(500).json({error: "Error in delete request: ", error});
	}
});

app.listen(3000, () => console.log('Server running on port 3000'));



describe('Test the book store API', () => {
	test('Test POST /books', () => {
    	return request(app)
        	.post('/books')
        	.send({id: 1, title: 'Book 1', author: 'Author 1', published_date: '2022-01-01', price: 9.99})
        	.expect(201);
	});

	test('Test invalid body POST /books', () => {
    	return request(app)
        	.post('/books')
        	.send({})
        	.expect(500);
	});

	test('Test GET /books/1', () => {
    	return request(app)
        	.get('/books/1')
        	.expect(200);
	});

	test('Test invalid book id GET /books/33', () => {
    	return request(app)
        	.get('/books/33')
        	.expect(500);
	});

	test('Test PUT /books/1', () => {
    	return request(app)
        	.put('/books/1')
        	.send({title: 'Updated Book 1', author: 'Updated Author 1', published_date: '2022-01-02', price: 19.99})
        	.expect(200);
	});

	test('Test invalid book id PUT /books/33', () => {
    	return request(app)
        	.put('/books/3')
        	.send({title: 'Updated Book 33', author: 'Updated Author 3', published_date: '2022-01-02', price: 19.99})
        	.expect(500);
	});


	test('Test DELETE /books/1', () => {
    	return request(app)
        	.delete('/books/1')
        	.expect(200);
	});
	test('Test invalid id DELETE /books/33', () => {
    	return request(app)
        	.delete('/books/33')
        	.expect(500);
	});

	test('Test GET /books', () => {
    	return request(app)
        	.get('/books')
        	.expect(200);
	});
});








// let books = [];

// app.get('/books', (req, res) => {
// });

// app.get('/books/:id', (req, res) => {
// });

// app.post('/books', (req, res) => {
// });

// app.put('/books/:id', (req, res) => {
// });

// app.delete('/books/:id', (req, res) => {
// });

// app.listen(3000, () => console.log('Server running on port 3000'));