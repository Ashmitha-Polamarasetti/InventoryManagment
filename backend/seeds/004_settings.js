export async function seed(knex) {
  await knex('settings').del();
  await knex('settings').insert([
    { company_name: 'Acme Retail', currency: 'USD', timezone: 'UTC', default_low_stock_threshold: 10 }
  ]);
}


