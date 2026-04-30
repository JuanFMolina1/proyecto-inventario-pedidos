import pool from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Articulo {
  id_articulo?: number;
  nombre: string;
  descripcion: string;
  precio?: number;
  stock?: number;
  fabricas?: string;
}

export class ArticuloModel {
  static async getAll(): Promise<Articulo[]> {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT
        a.id_articulo,
        a.nombre,
        a.descripcion,
        COALESCE(MIN(af.precio), 0) AS precio,
        COALESCE(SUM(af.existencias), 0) AS stock,
        COALESCE(GROUP_CONCAT(DISTINCT f.nombre ORDER BY f.nombre SEPARATOR ', '), '') AS fabricas
      FROM articulos a
      LEFT JOIN articulo_fabrica af ON af.id_articulo = a.id_articulo
      LEFT JOIN fabricas f ON f.id_fabrica = af.id_fabrica
      GROUP BY a.id_articulo, a.nombre, a.descripcion
      ORDER BY a.id_articulo DESC
    `);
    return rows as Articulo[];
  }

  static async getById(id: number): Promise<Articulo | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT
        a.id_articulo,
        a.nombre,
        a.descripcion,
        COALESCE(MIN(af.precio), 0) AS precio,
        COALESCE(SUM(af.existencias), 0) AS stock,
        COALESCE(GROUP_CONCAT(DISTINCT f.nombre ORDER BY f.nombre SEPARATOR ', '), '') AS fabricas
      FROM articulos a
      LEFT JOIN articulo_fabrica af ON af.id_articulo = a.id_articulo
      LEFT JOIN fabricas f ON f.id_fabrica = af.id_fabrica
      WHERE a.id_articulo = ?
      GROUP BY a.id_articulo, a.nombre, a.descripcion
      `,
      [id]
    );
    return rows.length > 0 ? (rows[0] as Articulo) : null;
  }

  static async create(articulo: Articulo): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO articulos (nombre, descripcion) VALUES (?, ?)',
      [articulo.nombre, articulo.descripcion]
    );
    return result.insertId;
  }

  static async update(id: number, articulo: Partial<Articulo>): Promise<boolean> {
    const campos: string[] = [];
    const valores: Array<string | number> = [];

    if (articulo.nombre !== undefined) {
      campos.push('nombre = ?');
      valores.push(articulo.nombre);
    }

    if (articulo.descripcion !== undefined) {
      campos.push('descripcion = ?');
      valores.push(articulo.descripcion);
    }

    if (campos.length === 0) {
      return false;
    }

    valores.push(id);

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE articulos SET ${campos.join(', ')} WHERE id_articulo = ?`,
      valores
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
