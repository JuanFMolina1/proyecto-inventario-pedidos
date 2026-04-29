import type { Request, Response } from 'express';
import { ArticuloFabricaAlternativaService } from '../services/articulo-fabrica-alternativa.service';
import { parseIntParam } from '../utils/params';

const articuloFabricaAltService = new ArticuloFabricaAlternativaService();

export class ArticuloFabricaAlternativaController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const alternativas = await articuloFabricaAltService.getAllArticulosFabricasAlternativas();
      res.json(alternativas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const idArticulo = parseIntParam(req.params.idArticulo);
      const idFabrica = parseIntParam(req.params.idFabrica);
      const alternativa = await articuloFabricaAltService.getArticuloFabricaAlternativaById(idArticulo, idFabrica);
      if (!alternativa) {
        res.status(404).json({ error: 'Fábrica alternativa no encontrada' });
        return;
      }
      res.json(alternativa);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByArticulo(req: Request, res: Response): Promise<void> {
    try {
      const idArticulo = parseIntParam(req.params.idArticulo);
      const alternativas = await articuloFabricaAltService.getAlternativasByArticulo(idArticulo);
      res.json(alternativas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const success = await articuloFabricaAltService.createArticuloFabricaAlternativa(req.body);
      res.status(201).json({ success, message: 'Fábrica alternativa registrada exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const idArticulo = parseIntParam(req.params.idArticulo);
      const idFabrica = parseIntParam(req.params.idFabrica);
      const success = await articuloFabricaAltService.deleteArticuloFabricaAlternativa(idArticulo, idFabrica);
      if (!success) {
        res.status(404).json({ error: 'Fábrica alternativa no encontrada' });
        return;
      }
      res.json({ message: 'Fábrica alternativa eliminada exitosamente' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
