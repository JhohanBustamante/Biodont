const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const correo = 'admin@biodont.com';

  const existing = await prisma.usuario.findUnique({ where: { correo } });
  if (existing) {
    console.log(`Usuario admin ya existe (${correo}) — sin cambios.`);
    return;
  }

  const password = await bcrypt.hash('Admin1234!', 10);

  const user = await prisma.usuario.create({
    data: {
      nombre:   'Admin',
      apellido: 'Biodont',
      correo,
      password,
      rol:    'ADMIN',
      activo: true,
    },
  });

  console.log(`✓ Usuario admin creado: ${user.correo} (id ${user.id})`);
  console.log('  Contraseña inicial: Admin1234!');
  console.log('  Cambia la contraseña después del primer inicio de sesión.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
