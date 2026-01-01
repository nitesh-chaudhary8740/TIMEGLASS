//const asyncHandler = (func)=>

//    async (req,res,next)=>{
//         try {
//             await func(req,res,next)
//         } catch (error) {
//             console.log(error)
//             res.status(error?.statusCode||500).json({msg:error?.msg||"Internal server error",sucess:false})
//         }
//     }
// utils/asyncHandler.js
const asyncHandler = (func) => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next);
};
export default asyncHandler