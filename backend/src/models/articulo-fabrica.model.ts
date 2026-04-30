import pool from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface ArticuloFabrica {
  id_articulo: number;
  id_fabrica: number;
  existencias: number;
  precio: number;
}

export class ArticuloFabricaModel {
  static async getAll(): Promise<ArticuloFabrica[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM articulo_fabrica');
    return rows as ArticuloFabrica[];
  }

  static async getById(idArticulo: number, idFabrica: number): Promise<ArticuloFabrica | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM articulo_fabrica WHERE id_articulo = ? AND id_fabrica = ?',
      [idArticulo, idFabrica]
    );
    return rows.length > 0 ? (rows[0] as ArticuloFabrica) : null;
  }

  static async getByArticulo(idArticulo: number): Promise<ArticuloFabrica[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM articulo_fabrica WHERE id_articulo = ?',
      [idArticulo]
    );
    return rows as ArticuloFabrica[];
  }

  static async getByFabrica(idFabrica: number): Promise<ArticuloFabrica[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM articulo_fabrica WHERE id_fabrica = ?',
      [idFabrica]
    );
    return rows as ArticuloFabrica[];
  }

  static async create(articuloFabrica: ArticuloFabrica): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO articulo_fabrica (id_articulo, id_fabrica, existencias, precio) VALUES (?, ?, ?, ?)',
      [
        articuloFabrica.id_articulo,
        articuloFabrica.id_fabrica,
        articuloFabrica.existencias,
        articuloFabrica.precio,
      ]
    );
    return result.affectedRows > 0;
  }

  static async update(
    idArticulo: number,
    idFabrica: number,
    cambios: { existencias?: number; precio?: number }
  ): Promise<boolean> {
    const campos: string[] = [];
    const valores: Array<number> = [];

    if (cambios.existencias !== undefined) {
      campos.push('existencias = ?');
      valores.push(cambios.existencias);
    }

    if (cambios.precio !== undefined) {
      campos.push('precio = ?');
      valores.push(cambios.precio);
    }

    if (campos.length === 0) {
      return false;
    }

    valores.push(idArticulo, idFabrica);

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE articulo_fabrica SET ${campos.join(', ')} WHERE id_articulo = ? AND id_fabrica = ?`,
      valores
    );
    return result.affectedRows > 0;
  }

  static async delete(idArticulo: number, idFabrica: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM articulo_fabrica WHERE id_articulo = ? AND id_fabrica = ?',
      [idArticulo, idFabrica]
    );
    return result.affectedRows > 0;
  }
}
