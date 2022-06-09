exports.errorMsgFormat = (error, type = 'users', code = 400) => {
    return {
        "code": code,
        "errors": true,
        "type": type,
        "response": error
    };
}

exports.validationFormat = (error) => {
    let errors = {};
    if (error.details) {
        error.details.forEach((detail) => {
            errors[detail.path] = detail.message;
        });
    } else {
        errors = error;
    }
    return this.errorMsgFormat({ message: errors }, 'validation', 400);
}

exports.successFormat = (data, type = 'users', code = 200, message = '') => {
    return {
        "code": code,
        "errors": false,
        "message" : message,
        "type": type,
        "data": data
        
    };
}