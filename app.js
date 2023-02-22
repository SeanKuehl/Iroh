var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var cookie = require('cookie');
var logger = require('morgan');
var session = require('express-session');
const store = new session.MemoryStore();	//not meant for production!


const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306,
  database: 'Iroh'
})
connection.connect()
//connection.end();

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.set('trust proxy', 1);
app.use(session({ secret: 'keyboardcat', resave: false,
  saveUninitialized: false,
  store: store}));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.get('/', (req, res) => {
	
	/*
  connection.connect()
	connection.query('SELECT * FROM albums', (err, rows, fields) => {
	  if (err) throw err
	  var something = rows[0]
	  console.log('The solution is: ', something.name)
	})
	
  connection.end()
  */
  //res.sendFile('public/hello.html' , { root : __dirname});
  res.sendFile('public/pages/IrohHomePage.html' , { root : __dirname});
})

app.get('/SignUp', (req, res) => {
	/*
  connection.connect()
	connection.query('SELECT * FROM albums', (err, rows, fields) => {
	  if (err) throw err
	  var something = rows[0]
	  console.log('The solution is: ', something.name)
	})
	
  connection.end()
  */
  res.sendFile('public/pages/IrohSignUpPage.html' , { root : __dirname});
})

app.get('/GetUserName', (req, res) => {
  
  

  
  const obj = JSON.parse(JSON.stringify(store.sessions)); // abc = [Object: null prototype] { id: '123' }
  
  
  
  var something = 0;
  
  
  for (let parameter in obj) {
    something = obj[parameter];
	something = JSON.parse(something);
	
  }
  
  res.send(something.user);
})

app.get('/MainPage', (req, res) => {
	
  res.sendFile('public/pages/IrohMainPage.html' , { root : __dirname});
})

app.get('/GetMostRecentFivePosts', (req, res) => {
	
	
	connection.query('SELECT * FROM posts ORDER BY postDate DESC LIMIT 5;', (err, rows, fields) => {
	  if (err) throw err
	  
	  console.log(rows);
	  
	  res.json(rows);
	  
	  
	})
	
  
  
  
})

app.get('/LogUserIn/:username/:userpassword', (req, res) => {
	
	
	var responseToUser = "ERROR";
	
	try {
		var userName = req.params.username;
		var userPassword = req.params.userpassword;
		
		if (userName === undefined || userPassword === undefined){
			responseToUser = "Invalid username or password"; 
			res.send(responseToUser).end();
		}
		else {
			
		
			
			connection.query('SELECT * FROM irohuser WHERE userName = "'+userName+'";', (err, rows, fields) => {
			  if (err || rows === undefined || !rows.length) {
				  responseToUser = "Invalid username or password"; 
				  res.send(responseToUser).end();
				  return;
			  }
				  
			  
			  if (rows[0].userName == userName && rows[0].userPassword == userPassword){
				  //user is valid, sign in
				  
				  responseToUser = "Log In Successful";
				  
				  console.log(userName);
				  req.session.user = userName;
				  
				  req.session.save();
				  
				  console.log(req.session.user);
				  res.send(responseToUser).end();
			  }
			  else {
				  
				 responseToUser = "Invalid username or password"; 
				 res.send(responseToUser).end();
			  }
				  
			  
			})
		}
		
	}
	catch (err) {
		responseToUser = "Invalid username or password"; 
		res.send(responseToUser).end();
	
	}
	
  
	
  
	
  
});

app.get('/LogIn', (req, res) => {
	/*
  connection.connect()
	connection.query('SELECT * FROM albums', (err, rows, fields) => {
	  if (err) throw err
	  var something = rows[0]
	  console.log('The solution is: ', something.name)
	})
	
  connection.end()
  */
  
  res.sendFile('public/pages/IrohLogInPage.html' , { root : __dirname});
});

/*
app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params)
})


Route path: /user/:userId(\d+)
Request URL: http://localhost:3000/user/42
req.params: {"userId": "42"}

*/

app.get('/createNewUser/:userName/:password', (req, res) => {
	var passedUserName = req.params.userName;
	var passedPassword = req.params.password;
	let userNameIsValid = false;
	console.log(passedUserName);
	console.log(passedPassword);
	
	//check for someone with same username already and don't allow it
	connection.query('SELECT * FROM irohuser WHERE userName = "'+passedUserName+'";', (err, rows, fields) => {
		if (err) throw res.send('an sql error occured');
		console.log(rows);
		if (rows.length < 1){
			userNameIsValid = true;
			
			connection.query('INSERT INTO irohuser (userName, userPassword) VALUES ("'+passedUserName+'","'+passedPassword+'");', (err, rows, fields) => {
				if (err) throw res.send('an sql error occured');
				req.session.user = userName;
				  
				req.session.save();
				res.send("Success");
			
			})
			
			
		}
		else if (rows.length >= 1){
			res.send('sorry, that username already exists');
			
		}
		
	})
	
	
});

app.post('/posts/:title/:body', (req, res) => {
	
	console.log(store);
	
	const obj = JSON.parse(JSON.stringify(store.sessions)); // abc = [Object: null prototype] { id: '123' }
	var something = 0;
	console.log(obj);
  
	for (let parameter in obj) {
		
		something = obj[parameter];
		something = JSON.parse(something);
	
	}
	
	var poster = something.user;
	var posterID = "blank";
	var title = req.params.title;
	var body = req.params.body;
	console.log(poster);
	console.log(posterID);
	console.log(title);
	console.log(body);
	//username should be unique based on signup check, use it to find posterID
	connection.query('SELECT * FROM irohuser WHERE userName = "'+poster+'";', (err, rows, fields) => {
		if (err) throw res.send('an sql error occured while getting userID');
		
		posterID = rows[0].userID;
		
		connection.query('INSERT INTO posts (posterID, posterName, title, body, postDate) VALUES ('+posterID+',"'+poster+'","'+title+'","'+body+'", NOW());', (err, rows, fields) => {
			if (err) throw res.send('an sql error occured while adding the post');
				
			res.send("success, new post added");
	
		})
	
	})
	
	
	
});

app.get('/posts', (req, res) => {
	//this sends the user the create posts html page
  
  res.sendFile('public/pages/IrohCreatePost.html' , { root : __dirname});
});

app.get('/LogOut', (req, res) => {
  store.clear((err) => {
	console.log("session cleared");	
	})
  req.session.destroy((err) => {
  res.redirect('/') // will always fire after session is destroyed
	})
  
  
});



app.get('/funky', (req, res) => {
  res.sendFile('public/hello.html' , { root : __dirname});
  
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
   res.sendFile('public/pages/IrohHomePage', { root : __dirname});
  //next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
