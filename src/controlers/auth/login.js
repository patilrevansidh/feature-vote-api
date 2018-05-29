const router = require('express').Router()
const connection = require('../../config/db');
const helper = require('../../common/helper/util');


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

module.exports = router;