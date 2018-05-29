const prepareSuccessBody = function (body) {
    const response = { success: true, data:{data:body} }
    return response
}

const prepareErrorBody = function (message) {
    const response = { success: false, message: message }
    return response
}

exports.prepareErrorBody = prepareErrorBody 
exports.prepareSuccessBody = prepareSuccessBody