import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento
const storage = multer.diskStorage({
  // Destino: dónde se guardan los archivos
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Crea una carpeta 'uploads' en la raíz de tu 'backend'
  },
  // Nombre del archivo: nombre original + timestamp para evitar colisiones
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de archivos (opcional pero recomendado)
const fileFilter = (req, file, cb) => {
  // Acepta videos, pdfs, imagenes
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|wmv|pdf|doc|docx/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Error: Tipo de archivo no soportado.'));
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Límite de 100MB (ajusta según necesites)
  fileFilter: fileFilter
});

export default upload;