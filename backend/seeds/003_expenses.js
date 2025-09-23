export async function seed(knex) {
  await knex('expenses').del();
  await knex('expenses').insert([
    { date: '2025-09-01', category: 'Utilities', amount: 230.50, description: 'Electricity bill' },
    { date: '2025-09-05', category: 'Supplies', amount: 480.00, description: 'Packaging materials' },
    { date: '2025-09-10', category: 'Logistics', amount: 1200.00, description: 'Monthly shipping contract' }
  ]);
}


