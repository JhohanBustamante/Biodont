// Configuración de PM2 para despliegue en servidor
// Uso: pm2 start ecosystem.config.js
//
// Antes de usar en producción, ajusta:
//   - cwd: ruta absoluta al directorio Biodont en el servidor
//   - DATABASE_URL: ruta absoluta al archivo .db
//   - JWT_SECRET: el mismo valor que usas en .env
//   - ALLOWED_ORIGIN: dominio o IP del cliente Angular (ej. 'http://192.168.1.10')

module.exports = {
  apps: [
    {
      name: 'biodont',
      script: 'src/server.js',
      cwd: '/var/www/Biodont',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
        DATABASE_URL: 'file:/var/www/Biodont/dev.db',
        JWT_SECRET: 'REEMPLAZAR_CON_TU_SECRET',
        ALLOWED_ORIGIN: '*',
      },
    },
  ],
};
