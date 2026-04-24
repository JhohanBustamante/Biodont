const {
  listDocumentosByPacienteService,
  createDocumentoService,
  getDocumentoArchivoService,
  deleteDocumentoService,
} = require('../services/documentos.service');

const listDocumentosByPaciente = async (req, res, next) => {
  try {
    const documentos = await listDocumentosByPacienteService(req.params.pacienteId);
    res.json({ data: documentos });
  } catch (err) {
    next(err);
  }
};

const createDocumento = async (req, res, next) => {
  try {
    const { pacienteId, tipo, fecha } = req.body;
    const documento = await createDocumentoService({
      pacienteId,
      tipo,
      fecha,
      file: req.file,
      user: req.user,
    });
    res.status(201).json({ data: documento });
  } catch (err) {
    next(err);
  }
};

const getDocumentoArchivo = async (req, res, next) => {
  try {
    const { documento, rutaAbsoluta } = await getDocumentoArchivoService(req.params.id);
    res.setHeader('Content-Type', documento.mimetype);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(documento.nombre)}"`);
    res.sendFile(rutaAbsoluta);
  } catch (err) {
    next(err);
  }
};

const deleteDocumento = async (req, res, next) => {
  try {
    await deleteDocumentoService(req.params.id);
    res.json({ message: 'Documento eliminado' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listDocumentosByPaciente,
  createDocumento,
  getDocumentoArchivo,
  deleteDocumento,
};
