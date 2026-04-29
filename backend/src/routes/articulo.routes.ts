import { Router } from 'express';
import { ArticuloController } from '../controllers/articulo.controller';

const router = Router();
const articuloController = new ArticuloController();

router.get('/', (req, res) => articuloController.getAll(req, res));
router.get('/:id', (req, res) => articuloController.getById(req, res));
router.post('/', (req, res) => articuloController.create(req, res));
router.put('/:id', (req, res) => articuloController.update(req, res));
router.delete('/:id', (req, res) => articuloController.delete(req, res));

export default router;
