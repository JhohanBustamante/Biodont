require('dotenv').config({ quiet: true });
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server funcionando V1, a través del puerto ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Puerto ${PORT} ya está en uso. Detén el proceso anterior antes de reiniciar.`);
        process.exit(1);
    }
    throw err;
});