import pool from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Direccion {
  id_direccion?: number;
  id_cliente: number;
  numero: string;
  calle: string;
  comuna: string;
  ciudad: string;
}

export class DireccionModel {
  static async getAll(): Promise<Direccion[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM direcciones');
    return rows as Direccion[];
  }

  static async getById(id: number): Promise<Direccion | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM direcciones WHERE id_direccion = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Direccion) : null;
  }

  static async getByCliente(idCliente: number): Promise<Direccion[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM direcciones WHERE id_cliente = ?',
      [idCliente]
    );
    return rows as Direccion[];
  }

  static async create(direccion: Direccion): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO direcciones (id_cliente, numero, calle, comuna, ciudad) VALUES (?, ?, ?, ?, ?)',
      [direccion.id_cliente, direccion.numero, direccion.calle, direccion.comuna, direccion.ciudad]
    );
    return result.insertId;
  }

  static async update(id: number, direccion: Partial<Direccion>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE direcciones SET id_cliente = ?, numero = ?, calle = ?, comuna = ?, ciudad = ? WHERE id_direccion = ?',
      [direccion.id_cliente, direccion.numero, direccion.calle, direccion.comuna, direccion.ciudad, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM direcciones WHERE id_direccion = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}
