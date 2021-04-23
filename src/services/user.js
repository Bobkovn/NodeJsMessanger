import UserModel from "../models/user.js"
import FileUtils from "../utils/files.js"
import validator from "../utils/validator.js"
import bcrypt from "bcryptjs"
import mongoose from "mongoose"


export default class UserService {
    async onUploadAvatar(user, avatar) {
        const fileName = await FileUtils.saveImage(avatar)
        user.avatars.push(fileName)
        await user.save()
    }

    async onDeleteAvatar(user, avatarUrl) {

    }

    async onGetUserByReferenceName(name) {
        return UserModel.findOne({referenceName: name});
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
            UserModel.getUserByIds(contactOutgoingRequestIds)]);
        return {
            contacts: [...contacts],
            incomingContacts: [...incomingContacts],
            outgoingContacts: [...outgoingContacts],
        }
    }

    async onDeleteContact(user, contactId) {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {

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
        const contact = UserModel.getUserById(contactId)

        const session = await mongoose.startSession()
        session.startTransaction()
        try {

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
        const session = await mongoose.startSession()
        session.startTransaction()
        try {

            await session.commitTransaction()
            session.endSession()
        } catch (e) {
            await session.abortTransaction()
            session.endSession()
            throw e
        }
    }

    async declineIncomingContactRequest(user, contactId) {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {

            await session.commitTransaction()
            session.endSession()
        } catch (e) {
            await session.abortTransaction()
            session.endSession()
            throw e
        }
    }

    async declineOutgoingContactRequest(user, contactId) {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {

            await session.commitTransaction()
            session.endSession()
        } catch (e) {
            await session.abortTransaction()
            session.endSession()
            throw e
        }
    }

    async blockUser(user, userId) {

    }

    async unblockUser(user, userId) {

    }

    async changePassword(user, newPassword, oldPassword) {
        const isPasswordsEqual = await bcrypt.compare(oldPassword, user.password)

        if (!isPasswordsEqual) {
            throw new Error('Invalid password')
        }

        validator.validatePassword(newPassword)

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)

        await UserModel.updateUser(user)
    }

    async updateUser(user) {
        return await UserModel.updateUser(user)
    }

    async onGetUserByToken(id, tokenType, token) {
        const user = await UserModel.findOne({_id: id, tokenType: token})

        if (!user) {
            throw new Error('Please authenticate')
        }
        return user
    }
}