const express = require('express');//Package express()
const PORT = process.env.PORT || 3030

require('dotenv').config()
//const firebase = require('./config/firebase')

const app = express();

const foodListRouter = require('./routes/foodRouter');
const { auth } = require('firebase');
//Add Router to Food List (By Zip)

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// app.get('/', (req, res) => {
// 	res.send('Hello');
// });

app.get('/', (req, res, next) => {
	res.render('index', { title: 'Local Restaraunt!!! Enter Zip' });
});

//Impliment this partial to use sign in -  <%- include('signup/index') %>
app.post('/signup', (req, res, next) => {
console.log(req.body)
firebase.doCreateUserWithEmailAndPassword(req.body.email, req.body.password)
	.then(authUser => {
		console.log(authUser)
	}).catch(err => {
		req.app.locals.err = err.message
		res.redirect('/')
	})

})

app.use('/food', foodListRouter);
//app.use('/user/food', userRouter) - when a user would look food up

app.listen(PORT, (err) =>
	console.log(`${err ? err : `Running on port ${PORT}`}`),
)

/* 

--Google Auth w/ firebase....?
*/