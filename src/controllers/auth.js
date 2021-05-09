import AutService from "../services/auth.js"
import Ajv from "ajv"

const ajv = new Ajv()
class AuthController {
    async logIn(req, res, next) {
        try {
            let body = req.body
            const schema = {
                type: "object",
                properties: {
                    email: {type: "string"},
                    password: {type: "string"}
                },
                required: ["email", "password"],
                additionalProperties: false,
            }

            const validate = ajv.compile(schema)
            const valid = validate(body)
            if (!valid) {
                return res.status(400).json(validate.errors)
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
            const schema = {
                type: "object",
                properties: {
                    name: {type: "string"},
                    referenceName: {type: "string"},
                    email: {type: "string"},
                    password: {type: "string"}
                },
                required: ["name", "referenceName", "email", "password"],
                additionalProperties: false,
            }

            const validate = ajv.compile(schema)
            const valid = validate(body)
            if (!valid) {
                return res.status(400).json(validate.errors)
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