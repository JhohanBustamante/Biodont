const AppError = require('./AppError');

class NotFoudError extends AppError {
    constructor(message){
        super(message, 404)
    }
}

module.exports = NotFoudError;