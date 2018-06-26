const router = require('express').Router()
const connection = require('../../config/db');
const helper = require('../../common/helper/util');
var passport = require('passport');
const bcrypt = require('bcrypt');
const GooglePlusTokenStrategy = require('passport-google-plus-token');


router.post('/login',(req,res)=>{

    connection.query("SELECT * from users where username=?",[req.body.username],(error,result,fields)=>{
        if(error) {
            console.log("login error",error)
        }
        if(Array.isArray(result) && result.length > 0) {
            let isMatch = undefined;
            let user = {}
            result.forEach((r)=>{
                isMatch = bcrypt.compareSync(req.body.password,r.password)
                if(isMatch) {
                    delete r.password
                    const user = helper.prepareSuccessBody(r)
                    res.send(user);
                }
            });
            if(!isMatch) {
                const user = helper.prepareErrorBody('Invalid username or password')
                res.send(user)
            }
        }else {            
            const user = helper.prepareErrorBody('Invalid username or password')
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
