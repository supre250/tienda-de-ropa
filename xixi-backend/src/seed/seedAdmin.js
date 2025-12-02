// ------------------------------------------------------
// Script para crear un usuario ADMIN inicial.
// Ejecutar con: node src/seed/seedAdmin.js
// ------------------------------------------------------
const { connectDB } = require('../config/db');
const { config } = require('../config/env');
const User = require('../models/User');

const run = async () => {
  try {
    await connectDB();

    const adminEmail = 'admin@xixi.com';

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('👑 El usuario admin ya existe:', adminEmail);
    } else {
      admin = new User({
        name: 'Administrador XI-XI',
        email: adminEmail,
        password: 'Admin1234', // se encripta automáticamente
        role: 'ADMIN',
      });

      await admin.save();
      console.log('✅ Usuario admin creado:');
      console.log('    email:    ', adminEmail);
      console.log('    password: ', 'Admin1234');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear el admin:', error);
    process.exit(1);
  }
};

run();
