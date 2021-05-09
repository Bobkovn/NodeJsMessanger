import mongoose from "mongoose"
import validator from "../utils/validator.js"

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        referenceName: {
            type: String,
            required: true,
            unique: true,
            maxlength: 10,
            minlength: 2
        },
        bio: {
            type: String,
            trim: true,
            maxlength: 500
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.validateEmail(value)) {
                    throw new Error('Email is invalid')
                }
            }
        },
        password: {
            type: String,
            required: true,
        },
        online: Boolean,
        onlineStatus: String,
        lastSeen: Date,
        avatars: [String],
        chatRoomIds: [String],
        contactIds: [String],
        contactIncomingRequestIds: [String],
        contactOutgoingRequestIds: [String],
        blockedUserIds: [String],
        token: String,
        refreshToken: String,
    },
    {
        timestamps: true,
        collection: "users",
    }
)

userSchema.statics.getUsers = async function () {
    return User.find()
}

userSchema.statics.getUserById = async function (id) {
    const user = await User.findOne({_id: id})
    if (!user) {
        throw new Error('No user with this id found')
    }
    return user
}

userSchema.statics.updateUser = async function (user) {
    return User.updateOne({_id: user._id}, user)
}

userSchema.statics.deleteUserById = async function (id) {
    return await this.remove({_id: id})
}

userSchema.statics.getUserByIds = async function (ids) {
    return User.find({_id: {$in: ids}})
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    userObject.id = userObject._id.toString()
    delete userObject._id
    delete userObject.password
    delete userObject.token
    delete userObject.email
    delete userObject.refreshToken
    delete userObject.online
    delete userObject.onlineStatus
    delete userObject.lastSeen
    delete userObject.chatRoomIds
    delete userObject.contactIds
    delete userObject.contactIncomingRequestIds
    delete userObject.contactOutgoingRequestIds
    delete userObject.blockedUserIds
    delete userObject.createdAt
    delete userObject.updatedAt
    delete userObject.__v

    return userObject
}

userSchema.methods.toPrivateJSON = function () {
    const user = this
    const userObject = user.toObject()

    userObject.id = userObject._id.toString()
    delete userObject._id
    delete userObject.password
    delete userObject.token
    delete userObject.refreshToken
    delete userObject.online
    delete userObject.lastSeen
    delete userObject.__v

    return userObject
}

const User = mongoose.model('User', userSchema)

export default User