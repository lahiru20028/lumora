import mongoose from 'mongoose';
import Product from './models/Product.js';

const MONGODB_URI = "mongodb://localhost:27017/lumora_candles"; // Your MongoDB URI

async function migrateCategories() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update categories
    const result1 = await Product.updateMany(
      { category: "Luxury" },
      { $set: { category: "Flower" } }
    );
    console.log(`Updated ${result1.modifiedCount} products from Luxury to Flower`);

    const result2 = await Product.updateMany(
      { category: "Jar" },
      { $set: { category: "Glass" } }
    );
    console.log(`Updated ${result2.modifiedCount} products from Jar to Glass`);

    const result3 = await Product.updateMany(
      { category: "Shaped" },
      { $set: { category: "Others" } }
    );
    console.log(`Updated ${result3.modifiedCount} products from Shaped to Others`);

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateCategories();