import { Router } from 'express';
import { ClienteController } from '../controllers/cliente.controller';

const router = Router();
const clienteController = new ClienteController();

router.get('/', (req, res) => clienteController.getAll(req, res));
router.get('/:id', (req, res) => clienteController.getById(req, res));
router.post('/', (req, res) => clienteController.create(req, res));
router.put('/:id', (req, res) => clienteController.update(req, res));
router.delete('/:id', (req, res) => clienteController.delete(req, res));

export default router;
