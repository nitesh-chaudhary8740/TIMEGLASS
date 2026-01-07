import Razorpay from 'razorpay';
import env from '../constants/env.js';
console.log(env.RAZORPAY_KEY_ID,env.RAZORPAY_KEY_SECRET)

const razorpay = new Razorpay({
key_id:env.RAZORPAY_KEY_ID,
key_secret:env.RAZORPAY_KEY_SECRET
});

export default razorpay;