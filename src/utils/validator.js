import Joi from "joi"

const passwordRegExp = new RegExp('^[a-zA-Z0-9]{7,30}$')

class Validator {
    validateEmail(email) {
        const schema = Joi.string().email()
        const {error} = schema.validate(email)
        return !error
    }

    validatePassword(password) {
        const schema = Joi.string().pattern(passwordRegExp)
        const {error} = schema.validate(password)
        return !error

    }
}

export default new Validator()