import mongoose from 'mongoose';
import Product from './src/models/product.model.js'; // Ensure the path is correct
import env from './src/constants/env.js';



const migrateExistingProducts = async () => {
  try {
    // 1. Connect to Database
    console.log(env.MONGO_URI,env.DBNAME,env.BRAND_NAME)
    await mongoose.connect(`${env.MONGO_URI}/${env.DBNAME}`);
    console.log("Connected to Database for migration...");

    // 2. Fetch all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products to check.`);

    let updatedCount = 0;

    for (let product of products) {
      if (product.images && product.images.length > 0 && product.defaultImage) {
        
        // Find the index of the image that matches the defaultImage URL
        const defaultIndex = product.images.findIndex(
          (img) => img.url === product.defaultImage.url
        );

        // If the default image is NOT at index 0, perform the swap
        if (defaultIndex > 0) {
          const imagesCopy = [...product.images];
          const temp = imagesCopy[0];
          imagesCopy[0] = imagesCopy[defaultIndex];
          imagesCopy[defaultIndex] = temp;

          // Update the document
          await Product.updateOne(
            { _id: product._id },
            { $set: { images: imagesCopy } }
          );
          
          updatedCount++;
          console.log(`Updated Product: ${product.name}`);
        }
      }
    }

    console.log(`Migration Complete. ${updatedCount} products were rearranged.`);
    process.exit(0);
  } catch (error) {
    console.error("Migration Error:", error);
    process.exit(1);
  }
};

migrateExistingProducts();