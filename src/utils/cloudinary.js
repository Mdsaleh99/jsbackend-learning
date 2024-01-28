import { v2 as cloudinary } from "cloudinary";
import fs from "fs";  // Node.js file system module to read files from the server file system and send them to Cloudinary.   https://nodejs.org/api/fs.html

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


const uploadOnCloudinary = async (localFilePath) => {   // cloudinary.v2.uploader.upload() method to upload a file to Cloudinary. The method takes the path to the file on the server as the first argument and an object with upload options as the second argument. The method returns a promise that resolves to the uploaded file's details.       >>>>> https://cloudinary.com/documentation/image_upload_api_reference#upload_method
  try {
    if(!localFilePath) return null

    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {resource_type: "auto"})

    // file has been uploaded successfully
    // console.log("file uploaded on cloudinary", response.url);
    fs.unlinkSync(localFilePath)
    console.log(response);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
}



export { uploadOnCloudinary }