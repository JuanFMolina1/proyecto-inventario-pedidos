import type { Request, Response } from 'express';
import { DireccionService } from '../services/direccion.service';
import { parseIntParam } from '../utils/params';

const direccionService = new DireccionService();

export class DireccionController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const direcciones = await direccionService.getAllDirecciones();
      res.json(direcciones);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIntParam(req.params.id);
      const direccion = await direccionService.getDireccionById(id);
      if (!direccion) {
        res.status(404).json({ error: 'Dirección no encontrada' });
        return;
      }
      res.json(direccion);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByCliente(req: Request, res: Response): Promise<void> {
    try {
      const idCliente = parseIntParam(req.params.idCliente);
      const direcciones = await direccionService.getDireccionesByCliente(idCliente);
      res.json(direcciones);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const id = await direccionService.createDireccion(req.body);
      res.status(201).json({ id, message: 'Dirección creada exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIntParam(req.params.id);
      const success = await direccionService.updateDireccion(id, req.body);
      if (!success) {
        res.status(404).json({ error: 'Dirección no encontrada' });
        return;
      }
      res.json({ message: 'Dirección actualizada exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIntParam(req.params.id);
      const success = await direccionService.deleteDireccion(id);
      if (!success) {
        res.status(404).json({ error: 'Dirección no encontrada' });
        return;
      }
      res.json({ message: 'Dirección eliminada exitosamente' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
