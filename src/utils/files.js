import * as uuid from 'uuid'
import * as path from 'path'
import fs from 'fs'

class FileUtils {
    async saveImage(file) {
        const fileName = uuid.v4() + '.jpg'
        const filePath = path.resolve('./images', fileName)
        await file.mv(filePath)
        return fileName
    }

    async deleteImage(filePath) {
        await fs.unlink(filePath, (err) => {
            if (err) {
                throw err;
            }
        })
    }
}

export default new FileUtils()
