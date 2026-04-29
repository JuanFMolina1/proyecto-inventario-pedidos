import { Router } from 'express';
import { FabricaController } from '../controllers/fabrica.controller';

const router = Router();
const fabricaController = new FabricaController();

router.get('/', (req, res) => fabricaController.getAll(req, res));
router.get('/:id', (req, res) => fabricaController.getById(req, res));
router.post('/', (req, res) => fabricaController.create(req, res));
router.put('/:id', (req, res) => fabricaController.update(req, res));
router.delete('/:id', (req, res) => fabricaController.delete(req, res));

export default router;
