import multer from "multer";   // multer and jwt documentation github se dekhna hai complusory


// yah pe diskstorage ka use kiya hai ....   https://github.com/expressjs/multer/blob/master/README.md
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname)
  }
})

export const upload = multer({ 
    storage
})