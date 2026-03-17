const express = require('express');
const prisma = require('./config/prisma');

const pacientesRoutes = require('./routes/pacientes.routes');
const citasRoutes = require('./routes/citas.routes');
const finanzasRoutes = require('./routes/finanzas.routes');
const odontogramaRoutes = require('./routes/odontograma.routes');
const authRoutes = require('./routes/auth.routes.js');


const cors = require('cors');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/pacientes', pacientesRoutes);
app.use('/citas', citasRoutes)
app.use('/finanzas', finanzasRoutes)
app.use('/odontograma', odontogramaRoutes)
app.use('/auth', authRoutes)


app.get('/api/v1/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

module.exports = app;