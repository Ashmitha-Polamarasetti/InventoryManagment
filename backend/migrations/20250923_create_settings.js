export function up(knex) {
  return knex.schema.createTable('settings', (t) => {
    t.increments('id').primary();
    t.string('company_name').notNullable().defaultTo('Acme Inc.');
    t.string('logo_filename');
    t.string('currency').notNullable().defaultTo('USD');
    t.string('timezone').notNullable().defaultTo('UTC');
    t.integer('default_low_stock_threshold').notNullable().defaultTo(10);
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists('settings');
}


