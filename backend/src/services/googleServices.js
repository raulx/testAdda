import google from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID, // Your Google Client ID
    process.env.CLIENT_SECRET, // Your Google Client Secret
    process.env.GOOGLE_OAUTH_CLIENT_SECRET // Your redirect URI after login
);

export { oauth2Client };
