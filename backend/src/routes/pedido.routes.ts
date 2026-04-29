import { Router } from 'express';
import { PedidoController } from '../controllers/pedido.controller';

const router = Router();
const pedidoController = new PedidoController();

router.get('/', (req, res) => pedidoController.getAll(req, res));
router.get('/:id', (req, res) => pedidoController.getById(req, res));
router.get('/cliente/:idCliente', (req, res) => pedidoController.getByCliente(req, res));
router.post('/', (req, res) => pedidoController.create(req, res));
router.put('/:id', (req, res) => pedidoController.update(req, res));
router.delete('/:id', (req, res) => pedidoController.delete(req, res));

export default router;
