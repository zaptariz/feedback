/*************************************
*  Message format for success response

* @param {  any   }   error   ( Error response data )
* @param { string }   type    ( type of the request )
* @param { number }   code    ( http StatusCodes    )
*
***************************************/
exports.errorMsgFormat = (error, type = 'users', code = 400) => {
    return {
        "code": code,
        "errors": true,
        "type": type,
        "response": error
    };
}

/*************************************
*  Message format for validationFormat

* @param {  Object  }   error    ( for joi validation response data from error )
*
***************************************/
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

/*************************************
*  Message format for success response

* @param {  any   }   data    ( success response data )
* @param { string }   type    ( type of the request   )
* @param { number }   code    ( http StatusCodes      )
* @param { string }   message ( response message      )
*
***************************************/
exports.successFormat = (data, type = 'users', code = 200, message = '') => {
    return {
        "code": code,
        "errors": false,
        "message": message,
        "type": type,
        "data": data

    };
}