import pool from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Cliente {
  id_cliente?: number;
  saldo: number;
  limite_credito: number;
  descuento: number;
}

export class ClienteModel {
  static async getAll(): Promise<Cliente[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM clientes');
    return rows as Cliente[];
  }

  static async getById(id: number): Promise<Cliente | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM clientes WHERE id_cliente = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Cliente) : null;
  }

  static async create(cliente: Cliente): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO clientes (saldo, limite_credito, descuento) VALUES (?, ?, ?)',
      [cliente.saldo, cliente.limite_credito, cliente.descuento]
    );
    return result.insertId;
  }

  static async update(id: number, cliente: Partial<Cliente>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE clientes SET saldo = ?, limite_credito = ?, descuento = ? WHERE id_cliente = ?',
      [cliente.saldo, cliente.limite_credito, cliente.descuento, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM clientes WHERE id_cliente = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}
