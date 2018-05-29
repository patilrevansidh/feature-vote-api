const router = require('express').Router();
const connection = require('../../config/db');
const helper = require('../../common/helper/util');


connection.connect();

router.get('/',(req,res)=>{
    connection.query('SELECT * from features', function (error, results, fields) {
        if (error) {
            throw error
            res.send(error)
        };
        const response = helper.prepareSuccessBody(results);
        res.json(response)
    });
})


router.post('/',(req,res)=>{    
    connection.query(`INSERT INTO features(title, description,vote,voted_people) VALUES(?,?,?,?)`,[req.body.title,req.body.description,"0","vote:[]"], function (error, results, fields) {
        if (error) {
            console.log("error in row insert",error)
            throw error
            res.send(error)
        };
        console.log("row inserted",results)
        const response = helper.prepareSuccessBody(results);
        res.json(response)
    });
})

router.get('/:featureId',(req,res)=>{
    connection.query("SELECT * FROM features WHERE id= ?",[req.params.featureId], function (error, results, fields) {
        if (error) {
            console.log("error in row read",error)
            throw error
            res.send(error)
        };
        const response = helper.prepareSuccessBody(results);
        res.json(response)
    });
})

router.put('/:featureId/vote',(req,res)=>{
    const userID = req.body.user_id
    connection.query("SELECT * FROM features WHERE id= ?",[req.params.featureId],(error, results, fields)=>{
        if(error) {
            console.log("error in casting vote",error)
        }
        const record = JSON.parse(results[0].voted_people);
        const voted_people = [...record.vote,userID]
        const obj = JSON.stringify({vote:voted_people})
        const vote_length = voted_people.length;
        connection.query("UPDATE features SET voted_people = ?, vote = ? where id = ?",[obj, `${vote_length}` ,req.params.featureId],(error, results, fields)=>{
            if(error) {
                console.log("error in casting vote",error)
            }
       }) 
       res.send("casted vote")
    })
})


router.delete('/:featureId',(req,res)=>{
    connection.query("DELETE FROM features WHERE id= ?",[req.params.featureId], function (error, results, fields) {
        if (error) {
            console.log("error in row deletion",error)
            throw error
            res.send(error)
        };
        connection.query('SELECT * from features', function (error, results, fields) {
            if (error) {
                throw error
                res.send(error)
            };
            const response = helper.prepareSuccessBody(results);
            res.json(response)
        });
    });
})


module.exports = router