import UserService from '../services/user.js'
import multer from "multer"

const maxFileSize = 5 * 1024 * 1024

const upload = multer({
    limits: {
        fileSize: maxFileSize
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    },
}).single('avatar')

class UserController {

    async onUploadAvatar(req, res) {
        upload(req, res, async function (e) {
            if (e) {
                return res.status(500).json({error: e.error, message: e.message})
            }
            await UserService.onUploadAvatar(req.user, req.file, function (err, filePath) {
                if (err) {
                    return res.status(500).json({error: e.error, message: e.message})
                }
                return res.status(200).json({avatar: filePath})
            })
        })
    }

    async onDeleteAvatar(req, res) {
        try {
            await UserService.onDeleteAvatar(req.user, req.body.avatarUrl)
            return res.status(200).send()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }

    async onGetUserByReferenceName(req, res) {
        try {
            const user = await UserService.onGetUserByReferenceName(req.params.name)
            return res.status(200).json(user)
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }

    async onGetUserById(req, res) {
        try {
            const user = await UserService.onGetUserById(req.params.id)
            return res.status(200).json(user)
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }

    async onGetContacts(req, res) {
        try {
            const result = await UserService.onGetContacts(req.user)
            return res.status(200).json(result)
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }

    async onDeleteContact(req, res) {
        try {
            const result = await UserService.onDeleteContact(req.user, req.params.id)
            return res.status(200).json(result)
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }

    async onGetBlockedUsers(req, res) {
        try {
            const result = await UserService.onGetBlockedUsers(req.user)
            return res.status(200).json(result)
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }

    async onDeleteAccount(req, res) {
        try {
            await UserService.onDeleteAccount(req.user.id)
            return res.status(200).json({
                message: `Your account was deleted`
            })
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }

    async onGetUserAccount(req, res) {
        try {
            return res.status(200).json(req.user.toPrivateJSON())
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }

    async submitContactRequest(req, res) {
        try {
            const result = await UserService.submitContactRequest(req.user, req.params.id)
            return res.status(200).json({
                contact: result
            })
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }

    async sendContactRequest(req, res) {
        try {
            await UserService.sendContactRequest(req.user, req.params.id)
            return res.status(200).send()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }

    async declineIncomingContactRequest(req, res) {
        try {
            await UserService.declineIncomingContactRequest(req.user, req.params.id)
            return res.status(200).send()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }

    async declineOutgoingContactRequest(req, res) {
        try {
            await UserService.declineOutgoingContactRequest(req.user, req.params.id)
            return res.status(200).send()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }

    async deleteContact(req, res) {
        try {
            await UserService.deleteContact(req.user, req.params.id)
            return res.status(200).send()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }

    async blockUser(req, res) {
        try {
            await UserService.blockUser(req.user, req.params.id)
            return res.status(200).send()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }

    async unblockUser(req, res) {
        try {
            await UserService.unblockUser(req.user, req.params.id)
            return res.status(200).send()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }

    async changePassword(req, res) {
        try {
            await UserService.changePassword(req.user, req.body.password, req.body.oldPassword)
            return res.status(200).send()
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }

    async updateUser(req, res) {
        try {
            await UserService.updateUser(req.user)
            return res.status(200).json(req.user)
        } catch (e) {
            return res.status(500).json({error: e.error, message: e.message})
        }
    }
}

export default new UserController()