var User = require('../models/user');
var config = require("../../config");
var secretKey = config.secretKey;
var jsonwebtoken = require("jsonwebtoken");
var Story = require("../models/story");

function createToken(user){
    console.log(user);
    var token = jsonwebtoken.sign({
        _id:user._id,
        name:user.name,
        username: user.username
    },secretKey, {
        expiratesInMinute:1440
    })
    return token
}

module.exports = function(app, express,io) {
    var api = express.Router();
    
    api.post('/signup',function(req,res){
        console.log('request',req)
       var user = new User ({
           name: req.body.name,
           username: req.body.username,
           password: req.body.password
       });
       user.save(function(err,newStory){
           if (err) {
               res.send(err);
               return
             
           }
           io.emit('story',newStory)
           console.log('responding');
           res.json({message:'User has been created'});
       })
       
    });
    
    api.get('/users',function(req, res){
        User.find({}, function(err, users){
            if (err) {
                res.send(err);
                return
            }
            res.json(users);
        })
    })
    
    api.post('/login',function(req, res) {
        console.log('request body:',req.body)
        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function(err,user){
            if (err) throw err;
            if (!user) {
                res.send({message:"User doesn't exist"})
            }else if (user){
                var validPassword = user.comparePassword(req.body.password)
                if (!validPassword){
                    res.send({message:"Invalid Password"})
                }else{
                    var token = createToken(user);
                    res.json({
                        success:true,
                        message:"Successfully login!",
                        token: token
                    })
                }
            }
        })
    })
    // middleware here
    api.use(function(req,res,next){
        console.log("Somebody just came to our app!, and here is next");
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
        
        // check if token exist
        if (token) {
            jsonwebtoken.verify(token, secretKey, function(err,decoded){
                if (err) {
                    res.status(403).send({success:false,message:"failed to authenticate user"})
                }else{
                    req.decoded = decoded;
                    next();
                }
            })
        }else{
            res.status(403).send({success:false,message:"No token provided"});
        }
    })
    
    api.route('/')
        .post(function(req,res){
            console.log('Decoded request:',req.decoded);
            var story = new Story({
                creator: req.decoded.id,
                content: req.body.content
            })
            story.save(function(err,newStory){
                if (err) {res.send(err); return}
                console.log('New story here, trying to emit',newStory);
                console.log('emit',io.emit);
                io.emit('story',newStory);
                res.json({message:"New story created"});
            })
        })
        .get(function(req,res){
            Story.find({creator:req.decoded.id}, function(err, stories) {
                if (err){
                    res.send(err);
                    return;
                }
                res.send(stories);
            })
        })
    api.get('/me',function(req,res){
        res.json(req.decoded);
    });
    return api;
}