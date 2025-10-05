import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./public/img")
    },

    filename: (req, file, callback) => {
        const newFileName = Date.now() + "-" + file.originalname
        callback(null, newFileName);
    }
});

// creamos el middlware
const uploader = multer({storage});

export default uploader;