import pool from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface ArticuloFabricaAlternativa {
  id_articulo: number;
  id_fabrica: number;
}

export class ArticuloFabricaAlternativaModel {
  static async getAll(): Promise<ArticuloFabricaAlternativa[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM articulo_fabrica_alternativa');
    return rows as ArticuloFabricaAlternativa[];
  }

  static async getById(idArticulo: number, idFabrica: number): Promise<ArticuloFabricaAlternativa | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM articulo_fabrica_alternativa WHERE id_articulo = ? AND id_fabrica = ?',
      [idArticulo, idFabrica]
    );
    return rows.length > 0 ? (rows[0] as ArticuloFabricaAlternativa) : null;
  }

  static async getByArticulo(idArticulo: number): Promise<ArticuloFabricaAlternativa[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM articulo_fabrica_alternativa WHERE id_articulo = ?',
      [idArticulo]
    );
    return rows as ArticuloFabricaAlternativa[];
  }

  static async create(articuloFabricaAlt: ArticuloFabricaAlternativa): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO articulo_fabrica_alternativa (id_articulo, id_fabrica) VALUES (?, ?)',
      [articuloFabricaAlt.id_articulo, articuloFabricaAlt.id_fabrica]
    );
    return result.affectedRows > 0;
  }

  static async delete(idArticulo: number, idFabrica: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM articulo_fabrica_alternativa WHERE id_articulo = ? AND id_fabrica = ?',
      [idArticulo, idFabrica]
    );
    return result.affectedRows > 0;
  }
}
