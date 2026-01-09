import multer from 'multer';

const storage = multer.memoryStorage();

const chatFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only Images and PDFs are allowed for support tickets.'), false);
    }
};

export const uploadChat = multer({ 
    storage, 
    fileFilter: chatFileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for docs/images
});