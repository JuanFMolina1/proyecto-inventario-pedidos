import pool from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface ArticuloFabrica {
  id_articulo: number;
  id_fabrica: number;
  existencias: number;
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
      'INSERT INTO articulo_fabrica (id_articulo, id_fabrica, existencias) VALUES (?, ?, ?)',
      [articuloFabrica.id_articulo, articuloFabrica.id_fabrica, articuloFabrica.existencias]
    );
    return result.affectedRows > 0;
  }

  static async update(idArticulo: number, idFabrica: number, existencias: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE articulo_fabrica SET existencias = ? WHERE id_articulo = ? AND id_fabrica = ?',
      [existencias, idArticulo, idFabrica]
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
