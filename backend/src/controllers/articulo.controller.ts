import type { Request, Response } from 'express';
import { ArticuloService } from '../services/articulo.service';
import { parseIntParam } from '../utils/params';

const articuloService = new ArticuloService();

export class ArticuloController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const articulos = await articuloService.getAllArticulos();
      res.json(articulos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIntParam(req.params.id);
      const articulo = await articuloService.getArticuloById(id);
      if (!articulo) {
        res.status(404).json({ error: 'Artículo no encontrado' });
        return;
      }
      res.json(articulo);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const id = await articuloService.createArticulo(req.body);
      res.status(201).json({ id, message: 'Artículo creado exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIntParam(req.params.id);
      const success = await articuloService.updateArticulo(id, req.body);
      if (!success) {
        res.status(404).json({ error: 'Artículo no encontrado' });
        return;
      }
      res.json({ message: 'Artículo actualizado exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseIntParam(req.params.id);
      const success = await articuloService.deleteArticulo(id);
      if (!success) {
        res.status(404).json({ error: 'Artículo no encontrado' });
        return;
      }
      res.json({ message: 'Artículo eliminado exitosamente' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
