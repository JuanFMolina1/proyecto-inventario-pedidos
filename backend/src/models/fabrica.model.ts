import pool from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Fabrica {
  id_fabrica?: number;
  telefono: string;
}

export class FabricaModel {
  static async getAll(): Promise<Fabrica[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM fabricas');
    return rows as Fabrica[];
  }

  static async getById(id: number): Promise<Fabrica | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM fabricas WHERE id_fabrica = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Fabrica) : null;
  }

  static async create(fabrica: Fabrica): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO fabricas (telefono) VALUES (?)',
      [fabrica.telefono]
    );
    return result.insertId;
  }

  static async update(id: number, fabrica: Partial<Fabrica>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE fabricas SET telefono = ? WHERE id_fabrica = ?',
      [fabrica.telefono, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM fabricas WHERE id_fabrica = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}
