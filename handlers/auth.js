const db = require("../models");
const jwt = require("jsonwebtoken");

exports.signup = async function(req, res, next) {
  try {
    //create a user
    let user = await db.User.create(req.body);
    let {id, username, profileImageUrl} = user;
    
    //create a token (signing a token)
    //process.env.SECRET_KEY
    let token = jwt.sign(
      {
        id, 
        username,
        profileImageUrl
      },
        process.env.SECRET_KEY
    );
    console.log(token)
    return res.status(200).json({
      id,
      username,
      profileImageUrl,
      token
    });
  } catch(err) {
   
    //if validation fails
    // see what kind of error it is 
    // if it is a certain error
    // respond with the username/email is already taken
    if (err.code === 11000) {
      err.message = "Sorry, that username and/or email is already taken";
    }
    // otherwise send back a generic 400 status
    return next({
      status: 400,
      message: err.message
    });
  }
};

exports.signin = async function(req, res, next) {
  try {
    //finding a user
    let user = await db.User.findOne({
      email: req.body.email
    });
    let { id, username, profileImageUrl } = user;
    let isMatch = await user.comparePassword(req.body.password);
    if(isMatch) {
      let token = jwt.sign(
        {
          id,
          username,
          profileImageUrl
        },
        process.env.SECRET_KEY
      );
      return res.status(200).json({
        id,
        username,
        profileImageUrl,
        token
      });
    } else {
      return next({
        status: 400,
        message: "Invalid email/password"
      });
    }     
  } catch (err) {
    return next({
      status: 400,
      message: "Invalid email/password"
    });
  }
};