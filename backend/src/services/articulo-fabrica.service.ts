import { ArticuloFabricaModel, type ArticuloFabrica } from '../models/articulo-fabrica.model';

export class ArticuloFabricaService {
  async getAllArticulosFabricas(): Promise<ArticuloFabrica[]> {
    return await ArticuloFabricaModel.getAll();
  }

  async getArticuloFabricaById(idArticulo: number, idFabrica: number): Promise<ArticuloFabrica | null> {
    return await ArticuloFabricaModel.getById(idArticulo, idFabrica);
  }

  async getArticulosFabricaByArticulo(idArticulo: number): Promise<ArticuloFabrica[]> {
    return await ArticuloFabricaModel.getByArticulo(idArticulo);
  }

  async getArticulosFabricaByFabrica(idFabrica: number): Promise<ArticuloFabrica[]> {
    return await ArticuloFabricaModel.getByFabrica(idFabrica);
  }

  async createArticuloFabrica(articuloFabrica: ArticuloFabrica): Promise<boolean> {
    if (articuloFabrica.existencias < 0) {
      throw new Error('Las existencias no pueden ser negativas');
    }
    if (articuloFabrica.precio < 0) {
      throw new Error('El precio no puede ser negativo');
    }
    return await ArticuloFabricaModel.create(articuloFabrica);
  }

  async updateArticuloFabrica(
    idArticulo: number,
    idFabrica: number,
    cambios: { existencias?: number; precio?: number }
  ): Promise<boolean> {
    if (cambios.existencias !== undefined && cambios.existencias < 0) {
      throw new Error('Las existencias no pueden ser negativas');
    }
    if (cambios.precio !== undefined && cambios.precio < 0) {
      throw new Error('El precio no puede ser negativo');
    }
    return await ArticuloFabricaModel.update(idArticulo, idFabrica, cambios);
  }

  async deleteArticuloFabrica(idArticulo: number, idFabrica: number): Promise<boolean> {
    return await ArticuloFabricaModel.delete(idArticulo, idFabrica);
  }
}
