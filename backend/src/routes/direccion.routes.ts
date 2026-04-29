import { Router } from 'express';
import { DireccionController } from '../controllers/direccion.controller';

const router = Router();
const direccionController = new DireccionController();

router.get('/', (req, res) => direccionController.getAll(req, res));
router.get('/:id', (req, res) => direccionController.getById(req, res));
router.get('/cliente/:idCliente', (req, res) => direccionController.getByCliente(req, res));
router.post('/', (req, res) => direccionController.create(req, res));
router.put('/:id', (req, res) => direccionController.update(req, res));
router.delete('/:id', (req, res) => direccionController.delete(req, res));

export default router;
