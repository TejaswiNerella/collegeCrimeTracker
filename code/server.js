var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var connection = mysql.createConnection({
                host: '34.136.164.137',
                user: 'root',
                password: 'test1234',
                database: 'colleges'
});

connection.connect;


var app = express();

// set up ejs view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
  res.render('index', { title: 'Log In' });
});

app.get('/log',function(req,res){
  console.log('got to the logs page');
  res.render('logs', { title: 'Crime Log' });
});
app.get('/trends',function(req,res){
  res.render('trends', { title: 'Trends' });
});

app.post('/getCrimeData', function(req, res) {
  var crimetrend=req.body.crimeType;
  var startDate=req.body.startTime;
  var sql=`CALL getTrends('${crimetrend}','${startDate}')`;
  console.log(sql);
  console.log(crimetrend);
  console.log(startDate);
  connection.query(sql, function(err, results) {
    if (err) {
      console.error('Error fetching crimeTypes data:', err);
      res.status(500).send({ message: 'Error fetching crimeTypes data', error: err });
      return;
    }
    console.log(results[0]);
    res.json(results[0]);
  });
});
app.post('/relLog', function(req, res) {
  crimes=req.body.crimes;
  universities=req.body.universities;
  console.log(universities);
  res.redirect('/log');
});


app.get('/api/logs',function(req,res){
  if(crimes){
    if(!universities){
      return;
    }
    var sql = `SELECT UniversityName,crimeType,crimeAddress,occurredDate,occurredTime,reportedDate,reportedTime,city,state  FROM Crime c JOIN Universities u ON u.UniversityId=c.universityId WHERE crimeType IN(${crimes}) AND UniversityName IN(${universities}) ORDER BY occurredDate DESC`;
  }
  else{
    if(universities){
      return;
    }
    var sql = `SELECT UniversityName,crimeType,crimeAddress,occurredDate,occurredTime,reportedDate,reportedTime,city,state  FROM Crime c JOIN Universities u ON u.UniversityId=c.universityId ORDER BY occurredDate DESC`;
  }
  console.log(sql);
  connection.query(sql, function(err, results) {
    if (err) {
      console.error('Error fetching log data:', err);
      res.status(500).send({ message: 'Error fetching log data', error: err });
      return;
    }
    res.json(results);
  });
});

app.get('/api/fillc',function(req,res){
  var sql = `SELECT DISTINCT crimeType  FROM Crime c`
  console.log(sql);
  connection.query(sql, function(err, results) {
    if (err) {
      console.error('Error fetching crimeTypes data:', err);
      res.status(500).send({ message: 'Error fetching crimeTypes data', error: err });
      return;
    }
    res.json(results);
  });
});

app.get('/api/fillu',function(req,res){
  var sql = `SELECT DISTINCT UniversityName  FROM Universities u`
  console.log(sql);
  connection.query(sql, function(err, results) {
    if (err) {
      console.error('Error fetching crimeTypes data:', err);
      res.status(500).send({ message: 'Error fetching crimeTypes data', error: err });
      return;
    }
    console.log(results.UniversityName);
    res.json(results);
  });
});

app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var sql = `SELECT password FROM User WHERE username='${username}'`;
  crimes=null;
  universities=null;


  console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    if(result.length>0 && result[0].password==password){
      res.redirect('/log');
    }
    else{
      res.status(500).send({message: 'The username or password is incorrect',error: 'incorrect password'});
    }
  });
});
app.get('/registration', function(req,res){
  res.render('registration',{ title: 'Register' });
});
app.get('/update', function(req,res){
  res.render('update',{ title: 'Update Information' });
});
app.get('/delete', function(req,res){
  res.render('delete',{ title: 'Delete Information' });
});
app.post('/updating', function(req, res) {

  username=req.body.username;
  password=req.body.password;
  newPass=req.body.newPass;
  address=req.body.address;
  city=req.body.city;
  state=req.body.state;
  var sql = `SELECT password FROM User WHERE username='${username}'`;
  console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      console.error('Error registering user', err);
      res.status(500).send({ message: 'Error registering user', error: err });
      return;
    }
    if(result.length>0 && result[0].password==password){
      res.redirect('/updater');
    }
    else{
      res.status(500).send({message: 'The username or password is incorrect',error: 'incorrect password'});
      return;
    }
  });
});
app.post('/deleting', function(req, res) {

  username=req.body.username;
  password=req.body.password;
  newPass=req.body.newPass;
  address=req.body.address;
  city=req.body.city;
  state=req.body.state;
  var sql = `SELECT password FROM User WHERE username='${username}'`;
  console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      console.error('Error registering user', err);
      res.status(500).send({ message: 'Error registering user', error: err });
      return;
    }
    if(result.length>0 && result[0].password==password){
      res.redirect('/deleter');
    }
    else{
      res.status(500).send({message: 'The username or password is incorrect',error: 'incorrect password'});
      return;
    }
  });
});
app.get('/updater', function(req,res){
  var sql=`UPDATE User SET password='${newPass}', address='${address}', city='${city}',state='${state}' WHERE username='${username}'`;
  console.log(sql);
  connection.query(sql, function(err, results) {
    if (err) {
      console.error('Error updating user', err);
      res.status(500).send({ message: 'Error registering user', error: err });
      return;
    }
    res.redirect('/');
  });
});
app.get('/deleter', function(req,res){
  var sql=`DELETE FROM User WHERE username='${username}'`;
  console.log(sql);
  connection.query(sql, function(err, results) {
    if (err) {
      console.error('Error updating user', err);
      res.status(500).send({ message: 'Error registering user', error: err });
      return;
    }
    res.redirect('/');
  });
});
app.post('/register', function(req, res) {

  var username=req.body.username;
  var password=req.body.password;
  var address=req.body.address;
  var city=req.body.city;
  var state=req.body.state;

  var sql = `INSERT INTO User(username,password,address,city,state) VALUES('${username}','${password}','${address}','${city}','${state}')`;
  console.log(sql);
  connection.query(sql, function(err, results) {
    if (err) {
      console.error('Error registering user', err);
      res.status(500).send({ message: 'Error registering user', error: err });
      return;
    }
    res.redirect('/');
  });
});


app.listen(80, function () {
    console.log('Node app is running on port 80');
});
