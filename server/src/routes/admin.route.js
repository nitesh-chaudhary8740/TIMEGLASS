import express from "express"
import asyncHandler from "../utils/asynchandler.util.js"
import { addProduct, adminLogin, adminLogout, adminProfile, deleteProduct, getProductDetails, getProducts, toggleProductStatus, updateProduct,  } from "../controllers/admin.controller.js"
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
const adminRouter = express.Router()
adminRouter.route("/login").post(asyncHandler(adminLogin))
adminRouter.route("/logout").post(asyncHandler(adminLogout))
adminRouter.route("/profile").get(verifyAdmin,asyncHandler(adminProfile))
adminRouter.route("/products/add").post(verifyAdmin,upload.array("productImages",10),asyncHandler(addProduct))
adminRouter.route("/products").get(verifyAdmin,asyncHandler(getProducts))
adminRouter.route("/products/:id")
    .get(verifyAdmin, asyncHandler(getProductDetails))
    .patch(verifyAdmin,upload.array('productImages', 5), asyncHandler(updateProduct))
    .delete(verifyAdmin, asyncHandler(deleteProduct));

adminRouter.route("/products/:id/status")
    .patch(verifyAdmin, asyncHandler(toggleProductStatus));
export default adminRouter