import pool from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Pedido {
  id_pedido?: number;
  id_cliente: number;
  id_direccion: number;
  fecha_hora?: Date;
}

export class PedidoModel {
  static async getAll(): Promise<Pedido[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM pedidos');
    return rows as Pedido[];
  }

  static async getById(id: number): Promise<Pedido | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM pedidos WHERE id_pedido = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as Pedido) : null;
  }

  static async getByCliente(idCliente: number): Promise<Pedido[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM pedidos WHERE id_cliente = ?',
      [idCliente]
    );
    return rows as Pedido[];
  }

  static async create(pedido: Pedido): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO pedidos (id_cliente, id_direccion, fecha_hora) VALUES (?, ?, ?)',
      [pedido.id_cliente, pedido.id_direccion, pedido.fecha_hora || new Date()]
    );
    return result.insertId;
  }

  static async update(id: number, pedido: Partial<Pedido>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE pedidos SET id_cliente = ?, id_direccion = ?, fecha_hora = ? WHERE id_pedido = ?',
      [pedido.id_cliente, pedido.id_direccion, pedido.fecha_hora, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM pedidos WHERE id_pedido = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}
