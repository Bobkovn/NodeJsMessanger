import UserService from '../services/user.js'
import multer from "multer";


const maxFileSize = 5 * 1024 * 1024

const upload = multer({
    dest: './images',
    limits: {
        fileSize: maxFileSize
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
}).single('avatar')

export default {
    onUploadAvatar: async (req, res) => {
        upload(req, res, async function (e) {
            if (e) {
                return res.status(500).json({error: e.error, message: e.message})
            }
            try {
                await UserService.onUploadAvatar(req.user, req.file)
                res.send()
            } catch (e) {
                return res.status(500).json({error: e.error, message: e.message})
            }
        })
    },
    onDeleteAvatar: async (req, res) => {
        try {
            await UserService.onDeleteAvatar(req.user, req.body.avatarUrl)
            return res.status(200).send()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    },
    onGetUserByReferenceName: async (req, res) => {
        try {
            const user = await UserService.onGetUserByReferenceName(req.params.name)
            return res.status(200).json(user)
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    },
    onGetUserById: async (req, res) => {
        try {
            const user = await UserService.onGetUserById(req.params.id)
            return res.status(200).json(user)
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    },
    onGetContacts: async (req, res) => {
        try {
            const result = await UserService.onGetContacts(req.user)
            return res.status(200).json(result)
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    },
    onDeleteContact: async (req, res) => {
        try {
            const result = await UserService.onDeleteContact(req.user, req.params.id)
            return res.status(200).json(result)
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    },
    onGetBlockedUsers: async (req, res) => {
        try {
            const result = await UserService.onGetBlockedUsers(req.user)
            return res.status(200).json(result)
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    },
    onDeleteAccount: async (req, res) => {
        try {
            await UserService.onDeleteAccount(req.user.id)
            return res.status(200).json({
                success: true,
                message: `Your account was deleted`
            })
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    },
    onGetUserAccount: async (req, res) => {
        try {
            return res.status(200).json(req.user)
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    },
    submitContactRequest: async (req, res) => {
        try {
            const result = await UserService.submitContactRequest(req.user, req.params.id)
            return res.status(200).json({
                success: true,
                message: `Contact submitted`,
                contact: result
            })
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    },
    sendContactRequest: async (req, res) => {
        try {
            await UserService.sendContactRequest(req.user, req.params.id)
            return res.status(200).send()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    },
    declineIncomingContactRequest: async (req, res) => {
        try {
            await UserService.declineIncomingContactRequest(req.user, req.params.id)
            return res.status(200).send()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    },
    declineOutgoingContactRequest: async (req, res) => {
        try {
            await UserService.declineOutgoingContactRequest(req.user, req.params.id)
            return res.status(200).send()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    },
    blockUser: async (req, res) => {
        try {
            await UserService.blockUser(req.user, req.params.id)
            return res.status(200).send()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    },
    unblockUser: async (req, res) => {
        try {
            await UserService.unblockUser(req.user, req.params.id)
            return res.status(200).send()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    },
    changePassword: async (req, res) => {
        try {
            await UserService.changePassword(req.user, req.body.password, req.body.oldPassword)
            return res.status(200).send()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    },
    updateUser: async (req, res) => {
        try {
            await UserService.updateUser(req.user)
            return res.status(200).json(req.user)
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    },
}