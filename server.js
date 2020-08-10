const express = require('express');//Package express()
const PORT = process.env.PORT || 3030

require('dotenv').config()
const app = express();

const indexRouter = require('./routes/index') //Will Route user to index.js file
const foodListRouter = require('./routes/foodList')
//Add Router to Food List (By Zip)

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))

// app.get('/', (req, res) => {
// 	res.send('Hello');
// });

app.get('/cat', (req, res) => {
    res.send('Roar!');
});

app.get('/gio', (req, res) => {
		res.send("This is My path. It's Mine. Leave now.");
})


app.use('/', indexRouter); //When User hits '/' (main page) use indexRouter
app.use('/food', foodListRouter);


app.listen(PORT, (err) =>
	console.log(`${err ? err : `Running on port ${PORT}`}`),
)
