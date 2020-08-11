const express = require('express');//Package express()
const PORT = process.env.PORT || 3030

require('dotenv').config()
const app = express();

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


app.get('/', (req, res, next) => {
	res.render('index', { title: 'Local Restaraunt!!! Enter Zip' });
});

app.use('/food', foodListRouter);
//app.use('/user/food', userRouter) - when a user would look food up

app.listen(PORT, (err) =>
	console.log(`${err ? err : `Running on port ${PORT}`}`),
)

/* ---- GIO's TO-DO LIST
--Get the listing pages working
--Make a "Next Page" Mechanic
--Impliment sort by (with pricing)
--Navbar Partials

--Google Auth w/ firebase....?
*/