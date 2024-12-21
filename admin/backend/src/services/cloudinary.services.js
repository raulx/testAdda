import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

import { ApiError } from '../utils/ApiError.js';

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
            folder: 'testAdda/question-shapes',
        });
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath); // unlink the file saved locally
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log(error);
        throw new ApiError(502, 'File upload failed'); // remove the locally saved temporary file as the upload operation got failed
    }
};

export { uploadOnCloudinary };
