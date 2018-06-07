const router = require('express').Router();
const connection = require('../../config/db');
const helper = require('../../common/helper/util');

router.get('/',helper.isAuthorized,(req,res)=>{
    const query = req.query.name ? req.query.name : '';
    connection.query('SELECT * FROM users where username like ?',[`%${query}%`],(error,result,field)=>{
        if (error) throw error;
        console.log("searched username",error)
        res.json(result);
    });    
})

module.exports = router;