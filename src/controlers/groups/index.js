const router = require('express').Router();
const connection = require('../../config/db');
const helper = require('../../common/helper/util');

router.get('/',(req,res)=>{
    const query = req.query.grpname ? req.query.grpname : ''
    connection.query('SELECT * FROM groups where name like ?',[`%${query}%`],(error,result,fields)=>{
        if (error) throw error
        res.json(helper.prepareSuccessBody(result));
    });
})

router.post('/',(req,res)=>{
    const user_ids = req.body.user_ids;
    const grp_name = req.body.name;
    connection.query('INSERT INTO groups(users,name) VALUES (?,?)',[user_ids,grp_name],(error,result,field)=>{
        console.log("error",error)
        if (error) throw error;
        res.json(helper.prepareSuccessBody(result));
    });
})


module.exports = router
