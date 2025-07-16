import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { Image } from './modals/ImageSchema.js'; // Make sure to use `.js` if using ES Modules

const router = express.Router();
dotenv.config();

//  Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Configuration (Memory storage)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and GIF are allowed.'));
    }
  },
});

// Upload Route
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    //  Promise wrapper for upload_stream
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const result = await streamUpload();


    //  Save Image Info to MongoDB
    const imageData = {
      url: result.secure_url,
      public_id: result.public_id,
      type: result.format,
      size: result.bytes,
      publisherId: req.userId
    };
      
    const image = new Image(imageData);
    await image.save();

    return res.status(201).json({
      message: 'Image uploaded and saved successfully.',
      data: image,
    });

  } catch (err) {
    console.error('Error uploading image:', err);
    return res.status(500).json({
      message: 'Image upload failed.',
      error: err.message,
    });
  }
});

router.get('/getImage', async(req,res) =>{

    const userId = req.userId;    
    try{
        const result = await Image.find({ publisherId: userId}).sort({uploaded_at: -1});
        if(!result){
            return res.status(404).json({ message: 'Image not found..'});
        }
        return res.status(200).json({ message: 'Image fetched successfully.. ',result})

    } catch (err) {
    console.error('Error uploading image:', err);
    return res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  }
})
export default router;
