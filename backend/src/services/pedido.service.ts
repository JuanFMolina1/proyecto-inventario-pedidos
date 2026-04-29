import { PedidoModel, type Pedido } from '../models/pedido.model';

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

  async createPedido(pedido: Pedido): Promise<number> {
    if (!pedido.id_cliente || !pedido.id_direccion) {
      throw new Error('El cliente y la dirección son requeridos');
    }
    return await PedidoModel.create(pedido);
  }

  async updatePedido(id: number, pedido: Partial<Pedido>): Promise<boolean> {
    return await PedidoModel.update(id, pedido);
  }

  async deletePedido(id: number): Promise<boolean> {
    return await PedidoModel.delete(id);
  }
}
