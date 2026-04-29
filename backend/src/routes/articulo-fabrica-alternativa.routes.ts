import { Router } from 'express';
import { ArticuloFabricaAlternativaController } from '../controllers/articulo-fabrica-alternativa.controller';

const router = Router();
const articuloFabricaAltController = new ArticuloFabricaAlternativaController();

router.get('/', (req, res) => articuloFabricaAltController.getAll(req, res));
router.get('/articulo/:idArticulo', (req, res) => articuloFabricaAltController.getByArticulo(req, res));
router.get('/:idArticulo/:idFabrica', (req, res) => articuloFabricaAltController.getById(req, res));
router.post('/', (req, res) => articuloFabricaAltController.create(req, res));
router.delete('/:idArticulo/:idFabrica', (req, res) => articuloFabricaAltController.delete(req, res));

export default router;
