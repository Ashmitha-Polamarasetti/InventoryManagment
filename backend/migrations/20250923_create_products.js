// insertProducts.js
import knex from 'knex';
import knexConfig from './knexfile.js'; // adjust path if needed

// Connect to DB using your development config
const db = knex(knexConfig.development);

async function insertProducts() {
  try {
    await db('products').insert([
      {
        name: 'Laptop',
        sku: 'LP12345',
        category: 'Electronics',
        quantity: 20,
        supplier: 'Dell',
        purchase_price: 45000,
        sale_price: 55000,
        status: 'active',
        low_stock_threshold: 5
      },
      {
        name: 'Mouse',
        sku: 'MS67890',
        category: 'Accessories',
        quantity: 100,
        supplier: 'Logitech',
        purchase_price: 500,
        sale_price: 750,
        status: 'active',
        low_stock_threshold: 20
      }
    ]);

    console.log('✅ Sample products inserted successfully!');
  } catch (error) {
    console.error('❌ Error inserting products:', error);
  } finally {
    await db.destroy(); // close connection
  }
}

insertProducts();
