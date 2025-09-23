export async function seed(knex) {
  await knex('products').del();
  await knex('products').insert([
    { name: 'Wireless Mouse', sku: 'WM-001', category: 'Accessories', quantity: 150, supplier: 'TechSupply', purchase_price: 8.5, sale_price: 19.99, status: 'active', low_stock_threshold: 20 },
    { name: 'Mechanical Keyboard', sku: 'MK-002', category: 'Accessories', quantity: 35, supplier: 'KeyMasters', purchase_price: 45.0, sale_price: 89.99, status: 'active', low_stock_threshold: 15 },
    { name: '27" Monitor', sku: 'MN-027', category: 'Displays', quantity: 8, supplier: 'DisplayWorld', purchase_price: 120.0, sale_price: 199.99, status: 'active', low_stock_threshold: 10 },
    { name: 'USB-C Cable', sku: 'UC-010', category: 'Cables', quantity: 400, supplier: 'CableCo', purchase_price: 2.0, sale_price: 6.99, status: 'active', low_stock_threshold: 50 }
  ]);
}


