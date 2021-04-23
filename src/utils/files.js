import * as uuid from 'uuid';
import * as path from 'path';

export default {
    saveImage: async (file) => {
        const fileName = uuid.v4() + '.jpg'
        const filePath = path.resolve('./images', fileName)
        await file.mv(filePath)
        return fileName
    },
    deleteImage: (filePath) => {

    }
}
