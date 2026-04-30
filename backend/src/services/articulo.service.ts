import pool from '../config/database';
import { ArticuloModel, type Articulo } from '../models/articulo.model';

export class ArticuloService {
  async getAllArticulos(): Promise<Articulo[]> {
    return await ArticuloModel.getAll();
  }

  async getArticuloById(id: number): Promise<Articulo | null> {
    return await ArticuloModel.getById(id);
  }

  async createArticulo(
    articulo: Articulo & { id_fabrica?: number; existencias?: number; precio?: number }
  ): Promise<number> {
    if (!articulo.nombre || articulo.nombre.trim() === '') {
      throw new Error('El nombre del artículo es requerido');
    }
    if (!articulo.descripcion || articulo.descripcion.trim() === '') {
      throw new Error('La descripción del artículo es requerida');
    }

    const requiereRelacion = articulo.id_fabrica !== undefined || articulo.existencias !== undefined || articulo.precio !== undefined;
    if (requiereRelacion) {
      if (articulo.id_fabrica === undefined) {
        throw new Error('La fábrica es requerida para relacionar el artículo');
      }
      if (articulo.existencias === undefined || articulo.existencias < 0) {
        throw new Error('Las existencias deben ser mayores o iguales a cero');
      }
      if (articulo.precio === undefined || articulo.precio < 0) {
        throw new Error('El precio debe ser mayor o igual a cero');
      }
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [articuloResult] = await connection.query<any>(
        'INSERT INTO articulos (nombre, descripcion) VALUES (?, ?)',
        [articulo.nombre, articulo.descripcion]
      );
      const idArticulo = Number(articuloResult.insertId);

      if (requiereRelacion) {
        await connection.query(
          'INSERT INTO articulo_fabrica (id_articulo, id_fabrica, existencias, precio) VALUES (?, ?, ?, ?)',
          [idArticulo, articulo.id_fabrica, articulo.existencias, articulo.precio]
        );
      }

      await connection.commit();
      return idArticulo;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateArticulo(id: number, articulo: Partial<Articulo>): Promise<boolean> {
    if (articulo.nombre !== undefined && articulo.nombre.trim() === '') {
      throw new Error('El nombre del artículo no puede estar vacío');
    }
    if (articulo.descripcion !== undefined && articulo.descripcion.trim() === '') {
      throw new Error('La descripción del artículo no puede estar vacía');
    }
    return await ArticuloModel.update(id, articulo);
  }

  async deleteArticulo(id: number): Promise<boolean> {
    return await ArticuloModel.delete(id);
  }
}
