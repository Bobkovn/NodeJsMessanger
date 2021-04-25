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

    async signUp({name, referenceName, email, password}) {
        validator.validateCredentials(email, password)

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        return await User.createUser(name, referenceName, email, hashedPassword)
    }

    async logOut(id) {
        return await User.updateUserById(id, {token: '', refreshToken: ''})
    }
}

export default new AuthService()