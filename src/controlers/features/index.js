const router = require('express').Router();
const connection = require('../../config/db');
const helper = require('../../common/helper/util');


connection.connect();

router.get('/',helper.isAuthorized,(req,res)=>{
    connection.query('SELECT * from features',function (error, results, fields) {
        if (error) {
            throw error
            res.send(error)
        };
        const user_id = req.get('user_id')
        const features = Array.isArray(results) 
                       ? results.map((f)=>{
                            const invited = f.invited.split(',');
                            if(invited.includes(user_id) || f.created_by == user_id) {
                                return f
                            }else{
                                return undefined
                            } 
                          }).filter(f=>f)
                        :[]
        console.log("get all features",features)
        const response = helper.prepareSuccessBody(features);
        res.json(response)
    });
})


router.post('/',helper.isAuthorized,(req,res)=>{    
    const voted_people = '';
    const invited = req.body.invited != undefined ? req.body.invited.toString() : '' ;
    const comments = '';
    const created_by = req.header('user_id');
    connection.query(`INSERT INTO features(title, description, vote, voted_people, invited, comments,created_by) VALUES
                            (?,?,?,?,?,?,?)`,
                            [req.body.title, req.body.description, "0", voted_people, invited, comments,created_by], function (error, results, fields) {
        if (error) {
            throw error
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

router.get('/:featureId',helper.isAuthorized,(req,res)=>{
    connection.query("SELECT * FROM features WHERE id= ?",[req.params.featureId], function (error, results, fields) {
        if (error) {
            console.log("error in row read",error)
            throw error
            res.send(error)
        };
        const response = results;
        const comments = results[0].comments.split(',')
        const commentsIds = results[0].comments.split(',').filter(d=>parseInt(d))
        connection.query('SELECT comments.comment, users.username FROM `comments` RIGHT JOIN users on users.id = comments.comment_by WHERE comments.id IN (?)',[commentsIds],(error,result,fields)=>{
            const obj =  {...response[0],comments:result}
            const newResponse = helper.prepareSuccessBody(obj)
            res.json(newResponse)
        })
    });
})

router.put('/:featureId/vote',helper.isAuthorized,(req, res)=>{
    const userID = req.body.user_id
    connection.query("SELECT * FROM features WHERE id= ?",[req.params.featureId],(error, results, fields)=>{
        if(error) {
            console.log("error in casting vote",error)
        }
        const record = results[0];
        const voted_people = record.voted_people.split(',').filter(d=>d);
        const newVoted = [...voted_people,userID]
        const vote_length = newVoted.length;
        connection.query("UPDATE features SET voted_people = ?, vote = ? where id = ?",[newVoted.toString(), `${vote_length}` ,req.params.featureId],(error, results, fields)=>{
            if(error) {
                console.log("error in casting vote",error)
            }
            connection.query('SELECT * from features', function (error, results, fields) {
                if (error) {
                    throw error
                    res.send(error)
                };            
                const response = helper.prepareSuccessBody(results);
                res.json(response)
            });
       })
    })
})

router.post('/:featureId/comments',helper.isAuthorized,(req, res)=>{
    const user_id = req.header('user_id');
    const feature_id = req.params.featureId;
    let newID;
    connection.query('INSERT into comments(comment,comment_by,feature_id) VALUES(?,?,?)', [req.body.comment, user_id, req.params.featureId],(error, result, fields)=>{
        if(error){
            res.send("Something went wrong")
        }
        newId = result.insertId;
        connection.query('select * from features where id = ?',[req.params.featureId],(error,results,fields)=>{
            const comments = results[0].comments.split(',').filter(d=>d);
            const newComments = [...comments,`${newId}`]            
            connection.query('UPDATE features SET comments =? where id = ?',[newComments.toString(),feature_id],(error, results, field)=>{
                connection.query("SELECT * FROM features WHERE id= ?",[req.params.featureId], function (error, results, fields) {
                    if (error) {
                        console.log("error in row read",error)
                        throw error
                        res.send(error)
                    };
                    const response = results;
                    const comments = results[0].comments.split(',')
                    const commentsIds = results[0].comments.split(',').filter(d=>parseInt(d))
                    connection.query('SELECT comments.comment, users.username FROM `comments` RIGHT JOIN users on users.id = comments.comment_by WHERE comments.id IN (?)',[commentsIds],(error,result,fields)=>{
                        const obj =  {...response[0],comments:result}
                        const newResponse = helper.prepareSuccessBody(obj)
                        res.json(newResponse)
                    })
                });
            });
        })
    })
})


router.delete('/:featureId',helper.isAuthorized,(req,res)=>{
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

// SELECT * FROM `features` ORDER BY id DESC    newest
// SELECT * FROM `features` ORDER BY vote DESC  most voted


 