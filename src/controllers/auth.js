import AutService from "../services/auth.js"
import makeValidation from "@withvoid/make-validation"

export default {
    logIn: async (req, res, next) => {
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
                return res.status(400).json(validation);
            }
            req.user = await AutService.logIn(body.email, body.password)
            next()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    },
    signUp: async (req, res, next) => {
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
                return res.status(400).json(validation);
            }
            req.user = await AutService.signUp(body)
            next()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    },
    logOut: async (req, res) => {
        try {
            let body = req.body
            const validation = makeValidation(types => ({
                payload: body,
                checks: {
                    id: {type: types.string},
                }
            }))
            if (!validation.success) {
                return res.status(400).json(validation);
            }
            await AutService.logOut(body.id)
            return res.status(200).json();
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    },
}