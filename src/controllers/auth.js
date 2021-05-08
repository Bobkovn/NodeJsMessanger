import AutService from "../services/auth.js"
import makeValidation from "@withvoid/make-validation"

class AuthController {
    async logIn(req, res, next) {
        try {
            let body = req.body
            const validation = makeValidation(types => ({
                payload: body,
                checks: {
                    email: {type: types.string},
                    password: {type: types.string},
                }
            }))
            if (!validation.success) {
                return res.status(400).json(validation)
            }
            req.user = await AutService.logIn(body.email, body.password)
            next()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }

    async signUp(req, res, next) {
        try {
            let body = req.body
            const validation = makeValidation(types => ({
                payload: body,
                checks: {
                    name: {type: types.string},
                    referenceName: {type: types.string},
                    email: {type: types.string},
                    password: {type: types.string},
                }
            }))
            if (!validation.success) {
                return res.status(400).json(validation)
            }
            req.user = await AutService.signUp(body)
            next()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }

    async logOut(req, res) {
        try {
            await AutService.logOut(req.user._id)
            return res.status(200).json()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }
}

export default new AuthController()