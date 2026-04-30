import type { Request, Response } from 'express';
import { PedidoService } from '../services/pedido.service';
import { parseIntParam } from '../utils/params';

const pedidoService = new PedidoService();

export class PedidoController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const pedidos = await pedidoService.getAllPedidos();
      res.json(pedidos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIntParam(req.params.id);
      const pedido = await pedidoService.getPedidoById(id);
      if (!pedido) {
        res.status(404).json({ error: 'Pedido no encontrado' });
        return;
      }
      res.json(pedido);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByCliente(req: Request, res: Response): Promise<void> {
    try {
      const idCliente = parseIntParam(req.params.idCliente);
      const pedidos = await pedidoService.getPedidosByCliente(idCliente);
      res.json(pedidos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await pedidoService.createPedido(req.body);
      res.status(201).json({ ...result, message: 'Pedido creado exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIntParam(req.params.id);
      const success = await pedidoService.updatePedido(id, req.body);
      if (!success) {
        res.status(404).json({ error: 'Pedido no encontrado' });
        return;
      }
      res.json({ message: 'Pedido actualizado exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIntParam(req.params.id);
      const success = await pedidoService.deletePedido(id);
      if (!success) {
        res.status(404).json({ error: 'Pedido no encontrado' });
        return;
      }
      res.json({ message: 'Pedido eliminado exitosamente' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
