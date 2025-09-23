export function up(knex) {
  return knex.schema.createTable('products', (t) => {
    t.increments('id').primary();
    t.string('name').notNullable();
    t.string('sku').notNullable().unique();
    t.string('category');
    t.integer('quantity').notNullable().defaultTo(0);
    t.string('supplier');
    t.decimal('purchase_price', 10, 2).notNullable().defaultTo(0);
    t.decimal('sale_price', 10, 2).notNullable().defaultTo(0);
    t.string('status').notNullable().defaultTo('active');
    t.integer('low_stock_threshold').notNullable().defaultTo(10);
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists('products');
}


