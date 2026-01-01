import expressRateLimiter from "express-rate-limit"
const limiterOptions = {
    windowMs:1*60*1000,
    max:5,
    message:"too many requests"
}
const limiter = expressRateLimiter(limiterOptions)
export default limiter