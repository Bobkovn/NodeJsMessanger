import express from 'express'

import authController from '../controllers/auth.js'
import {generateAuthTokens, refreshToken} from "../middlewares/jwt.js"
import {auth} from '../middlewares/jwt.js'

const router = express.Router()

router
    .post('/login', authController.logIn, generateAuthTokens)
    .post('/signup', authController.signUp, generateAuthTokens)
    .post('/logout', auth, authController.logOut)
    .post('/refreshToken', refreshToken)

export default router