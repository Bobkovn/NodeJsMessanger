import validator from "../utils/validator.utils.js"
import User from "../models/user.js"
import bcrypt from "bcryptjs"

class AuthService {
    async logIn(email, password) {
        validator.validateCredentials(email, password)

        const user = await User.findOne({email})

        if (!user) {
            throw new Error('Unable to login')
        }

        const isPasswordsEqual = await bcrypt.compare(password, user.password)

        if (!isPasswordsEqual) {
            throw new Error('Unable to login')
        }
        return user
    }

    async signUp(user) {
        validator.validateCredentials(user.email, user.password)

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

        return await User.create(user)
    }

    async logOut(id) {
        return User.updateOne({_id: id}, {token: '', refreshToken: ''})
    }
}

export default new AuthService()