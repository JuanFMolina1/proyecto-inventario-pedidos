import pool from '../config/database';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { PedidoModel, type Pedido } from '../models/pedido.model';

type PedidoItem = {
  id: number;
  cantidad: number;
};

export class PedidoService {
  async getAllPedidos(): Promise<Pedido[]> {
    return await PedidoModel.getAll();
  }

  async getPedidoById(id: number): Promise<Pedido | null> {
    return await PedidoModel.getById(id);
  }

  async getPedidosByCliente(idCliente: number): Promise<Pedido[]> {
    return await PedidoModel.getByCliente(idCliente);
  }

  async createPedido(pedido: Pedido & { items?: PedidoItem[] }): Promise<{ id: number; total: number }> {
    if (!pedido.id_cliente || !pedido.id_direccion) {
      throw new Error('El cliente y la dirección son requeridos');
    }
    if (!pedido.items || pedido.items.length === 0) {
      throw new Error('Debes agregar al menos un artículo al pedido');
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [clienteRows] = await connection.query<RowDataPacket[]>(
        'SELECT id_cliente, saldo, descuento FROM clientes WHERE id_cliente = ? FOR UPDATE',
        [pedido.id_cliente]
      );
      if (clienteRows.length === 0) {
        throw new Error('Cliente no encontrado');
      }

      const cliente = clienteRows[0];
      let subtotal = 0;

      for (const item of pedido.items) {
        if (!item.id || item.cantidad <= 0) {
          throw new Error('La cantidad debe ser mayor a 0');
        }

        const [articuloRows] = await connection.query<RowDataPacket[]>(
          `
          SELECT af.id_fabrica, af.existencias, af.precio, a.nombre
          FROM articulo_fabrica af
          INNER JOIN articulos a ON a.id_articulo = af.id_articulo
          WHERE af.id_articulo = ?
          ORDER BY af.precio ASC, af.id_fabrica ASC
          FOR UPDATE
          `,
          [item.id]
        );

        if (articuloRows.length === 0) {
          throw new Error(`No hay stock disponible para el artículo ${item.id}`);
        }

        const stockTotal = articuloRows.reduce((acc, row) => acc + Number(row.existencias || 0), 0);
        if (stockTotal < item.cantidad) {
          throw new Error(`Stock insuficiente para el artículo ${item.id}`);
        }

        let restante = item.cantidad;
        for (const fila of articuloRows) {
          if (restante <= 0) break;

          const disponible = Number(fila.existencias || 0);
          if (disponible <= 0) continue;

          const tomar = Math.min(restante, disponible);
          subtotal += tomar * Number(fila.precio || 0);

          await connection.query(
            'UPDATE articulo_fabrica SET existencias = existencias - ? WHERE id_articulo = ? AND id_fabrica = ?',
            [tomar, item.id, Number(fila.id_fabrica)]
          );

          restante -= tomar;
        }
      }

      const descuentoAplicado = subtotal * (Number(cliente.descuento || 0) / 100);
      const total = subtotal - descuentoAplicado;
      const saldoActual = Number(cliente.saldo || 0);
      const saldoNuevo = saldoActual - total;

      if (saldoNuevo < 0) {
        throw new Error('El saldo del cliente no es suficiente para cubrir el pedido');
      }

      const [pedidoResult] = await connection.query<ResultSetHeader>(
        'INSERT INTO pedidos (id_cliente, id_direccion, fecha_hora) VALUES (?, ?, ?)',
        [pedido.id_cliente, pedido.id_direccion, pedido.fecha_hora || new Date()]
      );
      const idPedido = Number(pedidoResult.insertId);

      for (const item of pedido.items) {
        await connection.query(
          'INSERT INTO detalle_pedido (id_pedido, id_articulo, cantidad) VALUES (?, ?, ?)',
          [idPedido, item.id, item.cantidad]
        );
      }

      await connection.query('UPDATE clientes SET saldo = ? WHERE id_cliente = ?', [saldoNuevo, pedido.id_cliente]);

      await connection.commit();
      return { id: idPedido, total };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updatePedido(id: number, pedido: Partial<Pedido>): Promise<boolean> {
    return await PedidoModel.update(id, pedido);
  }

  async deletePedido(id: number): Promise<boolean> {
    return await PedidoModel.delete(id);
  }
}
