import { Router } from 'express';
import { DetallePedidoController } from '../controllers/detalle-pedido.controller';

const router = Router();
const detallePedidoController = new DetallePedidoController();

router.get('/', (req, res) => detallePedidoController.getAll(req, res));
router.get('/:id', (req, res) => detallePedidoController.getById(req, res));
router.get('/pedido/:idPedido', (req, res) => detallePedidoController.getByPedido(req, res));
router.post('/', (req, res) => detallePedidoController.create(req, res));
router.put('/:id', (req, res) => detallePedidoController.update(req, res));
router.delete('/:id', (req, res) => detallePedidoController.delete(req, res));

export default router;
