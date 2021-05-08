import * as uuid from 'uuid'
import * as path from 'path'
import fs from 'fs'

class FileUtils {
    async saveImage(file, callback) {
        const fileName = uuid.v4() + "." + file.mimetype.split('/')[1]
        const filePath = path.resolve('images\\' + fileName)
        await fs.writeFile(filePath, file.buffer, function (err) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, fileName)
            }
        })
    }

    async deleteImage(filePath) {
        await fs.unlink(filePath, (err) => {
            if (err) {
                throw err
            }
        })
    }
}

export default new FileUtils()
