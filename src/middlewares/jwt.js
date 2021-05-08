import jwt from 'jsonwebtoken'
import UserService from '../services/user.js'


export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await UserService.onGetUserByToken(decoded._id, token)
        next()
    } catch (e) {
        res.status(401).send({error: e.error, message: e.message})
    }
}

export const generateAuthTokens = async (req, res) => {
    try {
        const user = req.user
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})
        const refreshToken = jwt.sign({_id: user._id}, process.env.REFRESH_JWT_SECRET, {expiresIn: "31d"})

        user.token = token
        user.refreshToken = refreshToken
        await user.save()

        return res
            .status(200)
            .json({
                user: user,
                token: token,
                refreshToken: refreshToken
            })
    } catch (e) {
        res.status(500).send({error: e.error, message: e.message})
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET)
        const user = await UserService.onGetUserByRefreshToken(decoded._id, refreshToken)

        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})

        user.token = token
        await user.save()

        return res
            .status(200)
            .json({
                token: token,
            })
    } catch (e) {
        res.status(401).send({error: e.error, message: e.message})
    }
}