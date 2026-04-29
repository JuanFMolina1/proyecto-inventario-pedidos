import { Router } from 'express';
import { ArticuloFabricaController } from '../controllers/articulo-fabrica.controller';

const router = Router();
const articuloFabricaController = new ArticuloFabricaController();

router.get('/', (req, res) => articuloFabricaController.getAll(req, res));
router.get('/articulo/:idArticulo', (req, res) => articuloFabricaController.getByArticulo(req, res));
router.get('/fabrica/:idFabrica', (req, res) => articuloFabricaController.getByFabrica(req, res));
router.get('/:idArticulo/:idFabrica', (req, res) => articuloFabricaController.getById(req, res));
router.post('/', (req, res) => articuloFabricaController.create(req, res));
router.put('/:idArticulo/:idFabrica', (req, res) => articuloFabricaController.update(req, res));
router.delete('/:idArticulo/:idFabrica', (req, res) => articuloFabricaController.delete(req, res));

export default router;
