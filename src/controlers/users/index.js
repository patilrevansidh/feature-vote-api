const router = require('express').Router();
const connection = require('../../config/db');

router.get('/',(req,res)=>{
    const query = req.query.name ? req.query.name : '';
    connection.query('SELECT * FROM users where username like ? and ',[`%${query}%`],(error,result,field)=>{
        if (error) throw error;
        console.log("searched username",result)
        res.json(result);
    });    
})

module.exports = router;