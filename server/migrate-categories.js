import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGO_URI;

async function migrateCategories() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Move "Christmas tree candle" to "Seasonal"
    const seasonalResult = await Product.updateMany(
      { name: { $regex: /Christmas/i } },
      { $set: { category: "Seasonal" } }
    );
    console.log(`Updated ${seasonalResult.modifiedCount} products to Seasonal (Christmas matches)`);

    // 2. Move "cup candle" to "Glass"
    const glassResult = await Product.updateMany(
      { name: { $regex: /cup|jar/i } },
      { $set: { category: "Glass" } }
    );
    console.log(`Updated ${glassResult.modifiedCount} products to Glass (Cup/Jar matches)`);

    // 3. Ensure any remaining "Luxury" -> "Flower" (Legacy migration)
    const result1 = await Product.updateMany(
      { category: "Luxury" },
      { $set: { category: "Flower" } }
    );
    console.log(`Updated ${result1.modifiedCount} products from Luxury to Flower`);

    // 4. Ensure any remaining "Shaped" -> "Others" (Legacy migration)
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