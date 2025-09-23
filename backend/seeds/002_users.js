export async function seed(knex) {
  await knex('users').del();
  await knex('users').insert([
    { name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
    { name: 'Manager Jane', email: 'jane.manager@example.com', role: 'manager', status: 'active' },
    { name: 'Staff John', email: 'john.staff@example.com', role: 'staff', status: 'active' }
  ]);
}


