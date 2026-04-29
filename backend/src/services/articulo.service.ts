import { ArticuloModel, type Articulo } from '../models/articulo.model';

export class ArticuloService {
  async getAllArticulos(): Promise<Articulo[]> {
    return await ArticuloModel.getAll();
  }

  async getArticuloById(id: number): Promise<Articulo | null> {
    return await ArticuloModel.getById(id);
  }

  async createArticulo(articulo: Articulo): Promise<number> {
    if (!articulo.descripcion || articulo.descripcion.trim() === '') {
      throw new Error('La descripción del artículo es requerida');
    }
    return await ArticuloModel.create(articulo);
  }

  async updateArticulo(id: number, articulo: Partial<Articulo>): Promise<boolean> {
    if (articulo.descripcion !== undefined && articulo.descripcion.trim() === '') {
      throw new Error('La descripción del artículo no puede estar vacía');
    }
    return await ArticuloModel.update(id, articulo);
  }

  async deleteArticulo(id: number): Promise<boolean> {
    return await ArticuloModel.delete(id);
  }
}
