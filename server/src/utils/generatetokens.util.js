import jwt from 'jsonwebtoken';
import ErrorResponse from './errorResponse.util.js';

export const generateAccessToken = (id) => {
    console.log(id)
   try {
     return jwt.sign(
         { id: id}, 
         process.env.JWT_ACCESS_SECRET, 
         {expiresIn:process.env.JWT_EXPIRES_IN}
     );
   } catch (error) {
      console.log(error)
      throw new ErrorResponse("failed to generate the token")
   }
};