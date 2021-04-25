import mongoose from "mongoose"
import validator from "validator"

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
                if (!validator.isEmail(value)) {
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

userSchema.statics.createUser = async function (
    name,
    referenceName,
    email,
    password,
) {
    return await this.create({name, referenceName, email, password})
}

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

userSchema.statics.updateUserById = async function (user) {
    return User.updateOne({_id: id}, user)
}

userSchema.statics.updateUser = async function (user) {
    return User.updateOne({_id: user.id}, user)
}

userSchema.statics.deleteUserById = async function (id) {
    return await this.remove({_id: id})
}

userSchema.statics.getUserByIds = async function (ids) {
    return User.find({_id: {$in: ids}})
}

// userSchema.pre('save', async function (next) {
//     if (this.isModified('password')) {
//         const salt = await bcrypt.genSalt(10)
//         this.password = await bcrypt.hash(this.password, salt)
//     }
//     next()
// })

// Delete user data when user is removed
// userSchema.pre('remove', async function (next) {
//     const user = this
//     await Task.deleteMany({ owner: user._id })
//     next()
// })

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    userObject.id = userObject._id.toString()
    delete userObject._id
    delete userObject.password
    delete userObject.token
    delete userObject.refreshToken
    delete userObject.online
    delete userObject.onlineStatus
    delete userObject.lastSeen
    delete userObject.chatRoomIds
    delete userObject.contactIds
    delete userObject.contactIncomingRequestIds
    delete userObject.contactOutgoingRequestIds
    delete userObject.blockedUserIds
    delete userObject.__v

    return userObject
}

const User = mongoose.model('User', userSchema)

export default User