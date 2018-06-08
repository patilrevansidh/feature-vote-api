const router = require('express').Router();
const connection = require('../../config/db');
const helper = require('../../common/helper/util');

router.get('/',helper.isAuthorized,(req,res)=>{
    let body = {}
    connection.query('select count(*) as total_users from users',(error,result,fields)=>{
        if(error) { throw error }
        body = {...body,users:result[0].total_users}
    });
    connection.query('SELECT COUNT(*) AS total_feature,SUM(vote) AS total_vote FROM featureS',(error,result,fields)=>{
        if(error) { throw error }
        const total_feature = result[0].total_feature;
        const total_vote = result[0].total_vote;
        body = {...body,total_feature, total_vote}
        res.send(helper.prepareSuccessBody(body))
    });    
})

module.exports = router;
