var application_root = __dirname,
  express = require("express"),
  routes = require("./routes"),
  path = require("path"),
  mongoose = require('mongoose');

var app = module.exports = express.createServer();

// Database
mongoose.connect('mongodb://localhost/namp');

// Config
app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}); 

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

/////////////////////////////////////////////////////////////////////
// Schema -> export later on
var Schema = mongoose.Schema;

var Soc = new Schema({  
     title: { type: String, required: true }
  ,  description: { type: String, required: false }
  ,  modified: { type: Date, default: Date.now }
});

var Datapoint = new Schema({
     title: { type: String, required: true }
  ,  description: { type: String, required: true }
  ,  modified: { type: Date, default: Date.now }
  ,  location: [Location]
  ,  tag: [Tag]
  ,  soc: [Soc]
});

var Location = new Schema({
     title: { type: String, required: true }
  ,  latitude: { type: String, required: true }
  ,  longitude: { type: String, required: true }
  ,  modified: { type: Date, default: Date.now }
});

var Tag = new Schema({
     title: { type: String, required: true }
  ,  description: { type: String, required: true }
  ,  modified: { type: Date, default: Date.now }
  ,  soc: [Soc]
});

/////////////////////////////////////////////////////////////////////
var SocModel = mongoose.model('Soc', Soc);

// Server Actions
app.get('/', routes.index);

// soc mappers -> export
/////////////////////////////////////////////////////////////////////
// read a list
app.get('/api/soc', function (req, res){
  return SocModel.find(function (err, socs) {
    if (!err) {
      return res.send(socs);
    } else {
      return console.log(err);
    }
  });
});

// create single
app.post('/api/soc', function (req, res){
  var soc1;
  console.log("POST: ");
  console.log(req.body);

  soc1 = new SocModel({
    title: req.body.title,
    description: req.body.description
  });

  soc.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(soc);
});

// read by id
app.get('/api/soc/:id', function (req, res){
  return SocModel.findById(req.params.id, function (err, soc1) {
    if (!err) {
      return res.send(soc1);
    } else {
      return console.log(err);
    }
  });
});

// update
app.put('/api/soc/:id', function (req, res){
  return SocModel.findById(req.params.id, function (err, soc1) {
    soc1.title = req.body.title;
    soc2.description = req.body.description;
    return soc1.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(soc1);
    });
  });
});

// delete by id
app.delete('/api/socs/:id', function (req, res){
  return SocModel.findById(req.params.id, function (err, soc1) {
    return soc1.remove(function (err) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
});
/////////////////////////////////////////////////////////////////////

// Launch Server
app.listen(3000); 
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
