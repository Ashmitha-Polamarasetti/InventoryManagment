export function up(knex) {
  return knex.schema.createTable('expenses', (t) => {
    t.increments('id').primary();
    t.date('date').notNullable();
    t.string('category').notNullable();
    t.decimal('amount', 10, 2).notNullable();
    t.string('description');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists('expenses');
}


