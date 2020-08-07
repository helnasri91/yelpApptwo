const express = require('express');
const PORT = process.env.PORT || 3030

require('dotenv').config()
const app = express();

//Add Router to Home (Index)
//Add Router to Food List (By Zip)

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.send('Hello');
});

app.get('/cat', (req,res) => {
    res.send('Roar!');
});

app.get('/gio', (req, res) => {
		res.send("This is My path. It's Mine. Leave now.");
})

/*
app.use('/', indexRouter);
app.use('/movies', moviesRouter);
*/

app.listen(PORT, (err) =>
	console.log(`${err ? err : `Running on port ${PORT}`}`),
);git
