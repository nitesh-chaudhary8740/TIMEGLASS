import express from  "express"
import limiter from "../config/limiter.config.js"

const userRouter = express.Router()
userRouter.route('/test').get(limiter,(req,res)=>{
 return res.send("okay")
})

export default userRouter