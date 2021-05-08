import express from 'express'
import user from '../controllers/user.js'
import {auth} from '../middlewares/jwt.js'

const router = express.Router()

router
    .post('/avatar', auth, user.onUploadAvatar)
    .delete('/avatar', auth, user.onDeleteAvatar)
    .get('/referenceName/:name', auth, user.onGetUserByReferenceName)
    .get('/me', auth, user.onGetUserAccount)
    .delete('/me', auth, user.onDeleteAccount)
    .get('/:id', auth, user.onGetUserById)
    .get('/contacts', auth, user.onGetContacts)
    .delete('/contacts/:id', auth, user.onDeleteContact)
    .get('/blockedUsers', auth, user.onGetBlockedUsers)
    .post('/submitContactRequest/:id', auth, user.submitContactRequest)
    .post('/sendContactRequest/:id', auth, user.sendContactRequest)
    .post('/declineIncomingContactRequest/:id', auth, user.declineIncomingContactRequest)
    .post('/declineOutgoingContactRequest/:id', auth, user.declineOutgoingContactRequest)
    .post('/block/:id', auth, user.blockUser)
    .post('/unblock/:id', auth, user.unblockUser)
    .patch('/changePassword', auth, user.changePassword)
    .patch('/', auth, user.updateUser)

export default router