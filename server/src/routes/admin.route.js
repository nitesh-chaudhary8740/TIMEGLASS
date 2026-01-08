import express from "express"
import asyncHandler from "../utils/asynchandler.util.js"
import { addProduct, adminLogin, adminLogout, adminProfile, deleteProduct, getDashboardStats, getProductDetails, getProducts, toggleProductStatus, updateProduct,  } from "../controllers/admin.controller.js"
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { confirmDelivery, getAllOrders, getAllTransactions, getOrderDetails, initiateDelivery, rollbackDeliveryInitiation, updateOrderStatus } from "../controllers/admin.order.controller.js"
import { getAllUsers, getUserDetails } from "../controllers/admin.csm.controller.js"

const adminRouter = express.Router()
adminRouter.route("/login").post(asyncHandler(adminLogin))
adminRouter.route("/logout").post(asyncHandler(adminLogout))
adminRouter.route("/profile").get(verifyAdmin,asyncHandler(adminProfile))
//stats
adminRouter.route("/stats").get(verifyAdmin,asyncHandler(getDashboardStats))

//products
adminRouter.route("/products/add").post(verifyAdmin,upload.array("productImages",10),asyncHandler(addProduct))
adminRouter.route("/products").get(verifyAdmin,asyncHandler(getProducts))
adminRouter.route("/products/:id")
    .get(verifyAdmin, asyncHandler(getProductDetails))
    .patch(verifyAdmin,upload.array('productImages', 5), asyncHandler(updateProduct))
    .delete(verifyAdmin, asyncHandler(deleteProduct));

adminRouter.route("/products/:id/status")
    .patch(verifyAdmin, asyncHandler(toggleProductStatus));

//orders
adminRouter.route('/orders').get(verifyAdmin,asyncHandler(getAllOrders))
adminRouter.route('/order/:id').put(verifyAdmin,asyncHandler(updateOrderStatus))
adminRouter.route('/order/:id').get(verifyAdmin,asyncHandler(getOrderDetails))
adminRouter.route('/order/:id/send-otp').post(verifyAdmin,asyncHandler(initiateDelivery))
adminRouter.route('/order/:id/verify-otp').put(verifyAdmin,asyncHandler(confirmDelivery))
adminRouter.route('/order/:id/rollback-delivery').put(verifyAdmin,asyncHandler(rollbackDeliveryInitiation))
adminRouter.route('/transactions').get(verifyAdmin,asyncHandler(getAllTransactions))

//user 
adminRouter.route('/users').get(verifyAdmin,asyncHandler(getAllUsers))
adminRouter.route('/user/:id').get(verifyAdmin,asyncHandler(getUserDetails))

export default adminRouter