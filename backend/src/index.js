import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';
import { v2 as cloudinary } from 'cloudinary';
import { google } from 'googleapis';

dotenv.config({
    path: './.env',
});

// cloudinary service configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

// google oAuth configuration
export const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    'postmessage'
);

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(
                `⚙️ Server is running at port : ${process.env.PORT || 8000}`
            );
        });
    })
    .catch((err) => {
        console.log('MONGO db connection failed !!! ', err);
    });
