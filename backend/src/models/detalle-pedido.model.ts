import pool from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface DetallePedido {
  id_detalle?: number;
  id_pedido: number;
  id_articulo: number;
  cantidad: number;
}

export class DetallePedidoModel {
  static async getAll(): Promise<DetallePedido[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM detalle_pedido');
    return rows as DetallePedido[];
  }

  static async getById(id: number): Promise<DetallePedido | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM detalle_pedido WHERE id_detalle = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as DetallePedido) : null;
  }

  static async getByPedido(idPedido: number): Promise<DetallePedido[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM detalle_pedido WHERE id_pedido = ?',
      [idPedido]
    );
    return rows as DetallePedido[];
  }

  static async create(detalle: DetallePedido): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO detalle_pedido (id_pedido, id_articulo, cantidad) VALUES (?, ?, ?)',
      [detalle.id_pedido, detalle.id_articulo, detalle.cantidad]
    );
    return result.insertId;
  }

  static async update(id: number, detalle: Partial<DetallePedido>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE detalle_pedido SET id_pedido = ?, id_articulo = ?, cantidad = ? WHERE id_detalle = ?',
      [detalle.id_pedido, detalle.id_articulo, detalle.cantidad, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM detalle_pedido WHERE id_detalle = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}
