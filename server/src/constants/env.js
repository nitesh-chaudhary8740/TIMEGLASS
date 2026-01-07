import dotenv from "dotenv";
dotenv.config();
const env = {
    PORT:process.env.PORT,
    DBNAME:process.env.DB_NAME,
    MONGO_URI:process.env.MONGO_URI,
    NODE_ENV:process.env.NODE_ENV,
    JWT_ACCESS_SECRET:process.env.JWT_ACCESS_SECRET,
    JWT_EXPIRES_IN:process.env.JWT_EXPIRES_IN,
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_URL:process.env.CLOUDINARY_URL,
    EMAIL_USER:process.env.EMAIL_USER,//sendgrid
    EMAIL_PASS:process.env.EMAIL_PASS,//sendgrid
    OAUTH_CLIENT_ID:process.env.OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET:process.env.OAUTH_CLIENT_SECRET,
    BRAND_NAME:process.env.BRAND_NAME,
   RAZORPAY_KEY_ID:process.env.RAZORPAY_KEY_ID,
   RAZORPAY_KEY_SECRET:process.env.RAZORPAY_KEY_SECRET,
}
// console.log(env)
Object.freeze(env)
export default env