import multer from "multer";
import fs from "fs";
import path from "path";
import sharp from "sharp";


const ext: any = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/webp': 'webp'

};
const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, 'src/images');
    },
    filename: (req, file, cb) => {
        const filename = file.originalname.toLowerCase().split(' ').join('_');
        const filenameArray = filename.split('.');
        filenameArray.pop();
        const filenameWithoutExtension = filenameArray.join('.');
        const extension = ext[file.mimetype];
        const finalFilename = filenameWithoutExtension + '-' + Date.now() + '.' + extension;
        cb(null, finalFilename);
    }
});

const multerMiddleware = multer({ storage: storage }).single('image');



module.exports.multerMiddleware = multerMiddleware;



module.exports.rezizeImage = async (req: any, res: any, next: any) => {
    if (!req.file) {
        return next();
    }

   
    const filePath = req.file.path;
    const filename = req.file.filename;

    const outputFilePath = path.join('src/images', `rezized-${filename}`);
     sharp(filePath)
        .resize(206, 260)
        .toFile(outputFilePath)
        .then(()  => {
            fs.unlink(filePath, async (err) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                req.file.path = outputFilePath;
                next();
            });
        })
        .catch((err) => {
    
            return res.status(500).json({ error: err });
        });
}
