import pool from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Articulo {
  id_articulo?: number;
  descripcion: string;
}

export class ArticuloModel {
  static async getAll(): Promise<Articulo[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM articulos');
    return rows as Articulo[];
  }

  static async getById(id: number): Promise<Articulo | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM articulos WHERE id_articulo = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Articulo) : null;
  }

  static async create(articulo: Articulo): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO articulos (descripcion) VALUES (?)',
      [articulo.descripcion]
    );
    return result.insertId;
  }

  static async update(id: number, articulo: Partial<Articulo>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE articulos SET descripcion = ? WHERE id_articulo = ?',
      [articulo.descripcion, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM articulos WHERE id_articulo = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}
