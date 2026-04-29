import type { Request, Response } from 'express';
import { ClienteService } from '../services/cliente.service';
import { parseIntParam } from '../utils/params';

const clienteService = new ClienteService();

export class ClienteController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const clientes = await clienteService.getAllClientes();
      res.json(clientes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIntParam(req.params.id);
      const cliente = await clienteService.getClienteById(id);
      if (!cliente) {
        res.status(404).json({ error: 'Cliente no encontrado' });
        return;
      }
      res.json(cliente);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const id = await clienteService.createCliente(req.body);
      res.status(201).json({ id, message: 'Cliente creado exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIntParam(req.params.id);
      const success = await clienteService.updateCliente(id, req.body);
      if (!success) {
        res.status(404).json({ error: 'Cliente no encontrado' });
        return;
      }
      res.json({ message: 'Cliente actualizado exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIntParam(req.params.id);
      const success = await clienteService.deleteCliente(id);
      if (!success) {
        res.status(404).json({ error: 'Cliente no encontrado' });
        return;
      }
      res.json({ message: 'Cliente eliminado exitosamente' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
