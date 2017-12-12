var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/comment_db');

mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

//message====
var MessageSchema = new mongoose.Schema({
 name: {type: String, required: true, minlength:4},
 message: { type: String, required: true, minlength:5 },
 comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
 }, {timestamps: true });

mongoose.model('Message', MessageSchema); 
var Message = mongoose.model('Message') 


 //comment=== 
var CommentSchema = new mongoose.Schema({
 name: {type: String, required: true, minlength:4},
 comments: { type: String, required: true, minlength:5 },
 _post: {type: Schema.Types.ObjectId, ref: 'Message'}
 }, {timestamps: true });

mongoose.model('Comment', CommentSchema); 
var Comment = mongoose.model('Comment') 


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var path = require('path');
app.use(express.static(path.join(__dirname, '/static')));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//route==========================================

app.get('/', function(req, res) {
    Message.find({}).populate('comments').exec(function(error, result){
         console.log(result);
        res.render('index', {postMessage: result});
    })
});


app.post('/messageAdd', function(req, res) {
  console.log("POST DATA", req.body);
  var newMessage = new Message({name: req.body.name, message: req.body.message });
  newMessage.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
      console.log('something went wrong');
    } else { // else console.log that we did well and then redirect to the root route
      console.log('successfully added a user!');
      res.redirect('/');
    }
  })
})

app.post('/commentAdd/:id', function(req, res) {
    Message.findOne({_id: req.params.id}, function(error,newMessage){
        console.log("POST DATA", req.body);
        console.log("newMessage", newMessage);
        var newComment = new Comment({name: req.body.name, comments: req.body.comments });
        newComment._post = newMessage._id;
        console.log("NEW COMMENTS",newComment);
        newComment.save(function(error){
            if (error) {  
                console.log(error);
            }else {
                console.log(error);
                console.log("newMessage", newMessage);
                newMessage.comments.push(newComment);
                newMessage.save(function(error){
                    if (error) {
                        console.log("error");
                    } else {
                        res.redirect('/');
                        console.log("comment added");
                    }
                })
            
            }

        })

    })
})
  




app.listen(8000, function() {
    console.log("listening on port 8000");
})
