import { ArticuloFabricaAlternativaModel, type ArticuloFabricaAlternativa } from '../models/articulo-fabrica-alternativa.model';

export class ArticuloFabricaAlternativaService {
  async getAllArticulosFabricasAlternativas(): Promise<ArticuloFabricaAlternativa[]> {
    return await ArticuloFabricaAlternativaModel.getAll();
  }

  async getArticuloFabricaAlternativaById(idArticulo: number, idFabrica: number): Promise<ArticuloFabricaAlternativa | null> {
    return await ArticuloFabricaAlternativaModel.getById(idArticulo, idFabrica);
  }

  async getAlternativasByArticulo(idArticulo: number): Promise<ArticuloFabricaAlternativa[]> {
    return await ArticuloFabricaAlternativaModel.getByArticulo(idArticulo);
  }

  async createArticuloFabricaAlternativa(articuloFabricaAlt: ArticuloFabricaAlternativa): Promise<boolean> {
    return await ArticuloFabricaAlternativaModel.create(articuloFabricaAlt);
  }

  async deleteArticuloFabricaAlternativa(idArticulo: number, idFabrica: number): Promise<boolean> {
    return await ArticuloFabricaAlternativaModel.delete(idArticulo, idFabrica);
  }
}
