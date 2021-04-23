import express from 'express';

import auth from '../controllers/auth.js'
import {generateAuthTokens, refreshToken} from "../middlewares/jwt.js"

const router = express.Router()

router
    .post('/login', auth.logIn, generateAuthTokens)
    .post('/signup', auth.signUp, generateAuthTokens)
    .post('/logout', auth.logOut)
    .post('/refreshToken', refreshToken)

export default router