import type { Request, Response } from 'express';
import { DetallePedidoService } from '../services/detalle-pedido.service';
import { parseIntParam } from '../utils/params';

const detallePedidoService = new DetallePedidoService();

export class DetallePedidoController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const detalles = await detallePedidoService.getAllDetallesPedidos();
      res.json(detalles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIntParam(req.params.id);
      const detalle = await detallePedidoService.getDetallePedidoById(id);
      if (!detalle) {
        res.status(404).json({ error: 'Detalle de pedido no encontrado' });
        return;
      }
      res.json(detalle);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByPedido(req: Request, res: Response): Promise<void> {
    try {
      const idPedido = parseIntParam(req.params.idPedido);
      const detalles = await detallePedidoService.getDetallesByPedido(idPedido);
      res.json(detalles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const id = await detallePedidoService.createDetallePedido(req.body);
      res.status(201).json({ id, message: 'Detalle de pedido creado exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIntParam(req.params.id);
      const success = await detallePedidoService.updateDetallePedido(id, req.body);
      if (!success) {
        res.status(404).json({ error: 'Detalle de pedido no encontrado' });
        return;
      }
      res.json({ message: 'Detalle de pedido actualizado exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIntParam(req.params.id);
      const success = await detallePedidoService.deleteDetallePedido(id);
      if (!success) {
        res.status(404).json({ error: 'Detalle de pedido no encontrado' });
        return;
      }
      res.json({ message: 'Detalle de pedido eliminado exitosamente' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
