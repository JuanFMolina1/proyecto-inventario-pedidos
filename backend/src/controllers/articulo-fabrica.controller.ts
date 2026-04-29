import type { Request, Response } from 'express';
import { ArticuloFabricaService } from '../services/articulo-fabrica.service';
import { parseIntParam } from '../utils/params';

const articuloFabricaService = new ArticuloFabricaService();

export class ArticuloFabricaController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const articulosFabricas = await articuloFabricaService.getAllArticulosFabricas();
      res.json(articulosFabricas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const idArticulo = parseIntParam(req.params.idArticulo);
      const idFabrica = parseIntParam(req.params.idFabrica);
      const articuloFabrica = await articuloFabricaService.getArticuloFabricaById(idArticulo, idFabrica);
      if (!articuloFabrica) {
        res.status(404).json({ error: 'Relación artículo-fábrica no encontrada' });
        return;
      }
      res.json(articuloFabrica);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByArticulo(req: Request, res: Response): Promise<void> {
    try {
      const idArticulo = parseIntParam(req.params.idArticulo);
      const articulosFabricas = await articuloFabricaService.getArticulosFabricaByArticulo(idArticulo);
      res.json(articulosFabricas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByFabrica(req: Request, res: Response): Promise<void> {
    try {
      const idFabrica = parseIntParam(req.params.idFabrica);
      const articulosFabricas = await articuloFabricaService.getArticulosFabricaByFabrica(idFabrica);
      res.json(articulosFabricas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const success = await articuloFabricaService.createArticuloFabrica(req.body);
      res.status(201).json({ success, message: 'Relación artículo-fábrica creada exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const idArticulo = parseIntParam(req.params.idArticulo);
      const idFabrica = parseIntParam(req.params.idFabrica);
      const { existencias } = req.body;
      const success = await articuloFabricaService.updateArticuloFabrica(idArticulo, idFabrica, existencias);
      if (!success) {
        res.status(404).json({ error: 'Relación artículo-fábrica no encontrada' });
        return;
      }
      res.json({ message: 'Existencias actualizadas exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const idArticulo = parseIntParam(req.params.idArticulo);
      const idFabrica = parseIntParam(req.params.idFabrica);
      const success = await articuloFabricaService.deleteArticuloFabrica(idArticulo, idFabrica);
      if (!success) {
        res.status(404).json({ error: 'Relación artículo-fábrica no encontrada' });
        return;
      }
      res.json({ message: 'Relación artículo-fábrica eliminada exitosamente' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
