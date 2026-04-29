import type { Request, Response } from 'express';
import { FabricaService } from '../services/fabrica.service';
import { parseIntParam } from '../utils/params';

const fabricaService = new FabricaService();

export class FabricaController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const fabricas = await fabricaService.getAllFabricas();
      res.json(fabricas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIntParam(req.params.id);
      const fabrica = await fabricaService.getFabricaById(id);
      if (!fabrica) {
        res.status(404).json({ error: 'Fábrica no encontrada' });
        return;
      }
      res.json(fabrica);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const id = await fabricaService.createFabrica(req.body);
      res.status(201).json({ id, message: 'Fábrica creada exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIntParam(req.params.id);
      const success = await fabricaService.updateFabrica(id, req.body);
      if (!success) {
        res.status(404).json({ error: 'Fábrica no encontrada' });
        return;
      }
      res.json({ message: 'Fábrica actualizada exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIntParam(req.params.id);
      const success = await fabricaService.deleteFabrica(id);
      if (!success) {
        res.status(404).json({ error: 'Fábrica no encontrada' });
        return;
      }
      res.json({ message: 'Fábrica eliminada exitosamente' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
