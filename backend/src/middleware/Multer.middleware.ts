import multer from "multer";


    const ext: any = {
        'image/png': 'png',
        'image/jpeg': 'jpeg',
        'image/jpg': 'jpg',
        'image/gif': 'gif',
        'image/svg+xml': 'svg',
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
            cb(null, filenameWithoutExtension + '-' + Date.now() + '.' + extension);
        }
    });
  
export const multerMiddleware = multer({ storage: storage }).single('image');