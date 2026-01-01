import express from "express"
import asyncHandler from "../utils/asynchandler.util.js"
import { adminLogin, adminLogout, checkAdminLoginState } from "../controllers/admin.controller.js"
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js"
const adminRouter = express.Router()
adminRouter.route("/admin-login").post(asyncHandler(adminLogin))
adminRouter.route("/admin-logout").post(asyncHandler(adminLogout))
adminRouter.route("/login-state").get(verifyAdmin,asyncHandler(checkAdminLoginState))
export default adminRouter