const router = require('express').Router()
const connection = require('../../config/db');
const helper = require('../../common/helper/util');
var passport = require('passport');
// var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');


router.post('/login',(req,res)=>{
    console.log("request",req)
    connection.query("SELECT * from users where username=? and password=?",[req.body.username,req.body.password],(error,result,fields)=>{
        if(error) {
            console.log("login error",error)
        }
        if(Array.isArray(result) && result.length == 0) {
            const user = helper.prepareErrorBody("Incorrect Username or Password")
            res.send(user)
        }else {
            
            const user = helper.prepareSuccessBody(result[0])
            res.send(user)
        }
    })
})

passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: "401469086263-0edqhedsh791l80lnunqhosv7jsj477m.apps.googleusercontent.com",
    clientSecret: "EzrVv99qciDjW27nk2cEMjko"
  }, async (accessToken, refreshToken, profile, done) => {
  }
))

router.post('/google',passport.authenticate('googleToken', { session: false }),(req,res)=>{}    );

module.exports = router;