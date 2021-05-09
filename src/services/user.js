import UserModel from "../models/user.js"
import FileUtils from "../utils/files.js"
import validator from "../utils/validator.js"
import bcrypt from "bcryptjs"
import mongoose from "mongoose"

class UserService {
    async onUploadAvatar(user, avatar, callback) {
        await FileUtils.saveImage(avatar, async function (err, fileName) {
            if (err) {
                callback(err, null)
            } else {
                const result = process.env.IMAGE_PATH + fileName
                user.avatars.push(result)
                await user.save()
                callback(null, result)
            }
        })
    }

    async onDeleteAvatar(user, avatarUrl, callback) {
        await FileUtils.deleteImage(avatarUrl, async function (err) {
            if (!err) {
                user.avatars = user.avatars.filter(url => url !== avatarUrl)
                await user.save()
            }
            callback(err)
        })
    }

    async onGetUserByReferenceName(name) {
        return UserModel.findOne({referenceName: name})
    }

    async onGetUserById(id) {
        return UserModel.getUserById(id)
    }

    async onGetContacts(user) {
        const contactIds = user.contactIds
        const contactIncomingRequestIds = user.contactIncomingRequestIds
        const contactOutgoingRequestIds = user.contactOutgoingRequestIds

        const [contacts, incomingContacts, outgoingContacts] = await Promise.all([UserModel.getUserByIds(contactIds),
            UserModel.getUserByIds(contactIncomingRequestIds),
            UserModel.getUserByIds(contactOutgoingRequestIds)])

        return {
            contacts: [...contacts],
            incomingContacts: [...incomingContacts],
            outgoingContacts: [...outgoingContacts],
        }
    }

    async onDeleteContact(user, contactId) {
        const contact = await UserModel.getUserById(contactId)
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            user.contactIds = user.contactIds.filter(id => id !== contactId)
            contact.contactIds = contact.contactIds.filter(id => id !== user.id)

            await Promise.all([UserModel.updateOne({_id: user._id}, user, {session}),
                UserModel.updateOne({_id: contact._id}, contact, {session})])

            await session.commitTransaction()
            session.endSession()
        } catch (e) {
            await session.abortTransaction()
            session.endSession()
            throw e
        }
    }

    async onGetBlockedUsers(user) {
        const blockedUserIds = user.blockedUserIds
        const blockedUsers = await UserModel.getUserByIds(blockedUserIds)
        return {
            blockedUsers
        }
    }

    async onDeleteAccount(id) {
        await UserModel.deleteUserById(id)
    }

    async submitContactRequest(user, contactId) {
        const contact = await UserModel.getUserById(contactId)
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            user.contactIds.push(contactId)
            contact.contactIds.push(user._id)

            user.contactIncomingRequestIds = user.contactIncomingRequestIds.filter(id => id !== contactId)
            contact.contactOutgoingRequestIds = contact.contactOutgoingRequestIds.filter(id => id !== user.id)

            await Promise.all([UserModel.updateOne({_id: user._id}, user, {session}),
                UserModel.updateOne({_id: contact._id}, contact, {session})])

            await session.commitTransaction()
            session.endSession()
            return contact
        } catch (e) {
            await session.abortTransaction()
            session.endSession()
            throw e
        }
    }

    async sendContactRequest(user, contactId) {
        const contact = await UserModel.getUserById(contactId)
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            user.contactOutgoingRequestIds.push(contactId)
            contact.contactIncomingRequestIds.push(user._id)

            await Promise.all([UserModel.updateOne({_id: user._id}, user, {session}),
                UserModel.updateOne({_id: contact._id}, contact, {session})])

            await session.commitTransaction()
            session.endSession()
        } catch (e) {
            await session.abortTransaction()
            session.endSession()
            throw e
        }
    }

    async declineIncomingContactRequest(user, contactId) {
        const contact = await UserModel.getUserById(contactId)
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            user.contactIncomingRequestIds = user.contactIncomingRequestIds.filter(id => id !== contactId)
            contact.contactOutgoingRequestIds = contact.contactOutgoingRequestIds.filter(id => id !== user.id)

            await Promise.all([UserModel.updateOne({_id: user._id}, user, {session}),
                UserModel.updateOne({_id: contact._id}, contact, {session})])

            await session.commitTransaction()
            session.endSession()
        } catch (e) {
            await session.abortTransaction()
            session.endSession()
            throw e
        }
    }

    async declineOutgoingContactRequest(user, contactId) {
        const contact = await UserModel.getUserById(contactId)
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            user.contactOutgoingRequestIds = user.contactOutgoingRequestIds.filter(id => id !== contactId)
            contact.contactIncomingRequestIds = contact.contactIncomingRequestIds.filter(id => id !== user.id)

            await Promise.all([UserModel.updateOne({_id: user._id}, user, {session}),
                UserModel.updateOne({_id: contact._id}, contact, {session})])

            await session.commitTransaction()
            session.endSession()
        } catch (e) {
            await session.abortTransaction()
            session.endSession()
            throw e
        }
    }

    async blockUser(user, userId) {
        user.blockedUserIds.push(userId)
        if (user.contacts.includes(userId)) {
            await this.onDeleteContact(user, userId)
        } else {
            await UserModel.updateOne({_id: user._id}, user)
        }
    }

    async unblockUser(user, userId) {
        user.blockedUserIds = user.blockedUserIds.filter(id => id !== userId)
        await UserModel.updateOne({_id: user._id}, user)
    }

    async changePassword(user, newPassword, oldPassword) {
        const isPasswordsEqual = await bcrypt.compare(oldPassword, user.password)

        if (!isPasswordsEqual) {
            throw new Error('Invalid password')
        }

        if (!validator.validatePassword(newPassword)) {
            throw new Error('Invalid password')
        }

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)

        await UserModel.updateUser(user)
    }

    async updateUser(user) {
        return await UserModel.updateUser(user)
    }

    async onGetUserByToken(id, token) {
        const user = await UserModel.findOne({_id: id, token: token})

        if (!user) {
            throw new Error('Please authenticate')
        }
        return user
    }

    async onGetUserByRefreshToken(id, token) {
        const user = await UserModel.findOne({_id: id, refreshToken: token})

        if (!user) {
            throw new Error('Please authenticate')
        }
        return user
    }
}

export default new UserService()