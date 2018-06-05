const prepareSuccessBody = function (body) {
    const response = { success: true, data:{data:body} }
    return response
}

const prepareErrorBody = function (message) {
    const response = { success: false, message: message }
    return response
}

const stringObjToArray = function (obj,key) {
    const arrObj = JSON.parse(obj)
    return arrObj[key]
}

const isAuthorized = function (req, res, next) {
    const user_id = req.get('user_id');
    if(user_id) {
        next();
    }else {
        res.send("Unauthorized User");
    }
}

exports.prepareErrorBody = prepareErrorBody;
exports.prepareSuccessBody = prepareSuccessBody;
exports.stringObjToArray = stringObjToArray;
exports.isAuthorized = isAuthorized