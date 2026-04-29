import { DetallePedidoModel, type DetallePedido } from '../models/detalle-pedido.model';

export class DetallePedidoService {
  async getAllDetallesPedidos(): Promise<DetallePedido[]> {
    return await DetallePedidoModel.getAll();
  }

  async getDetallePedidoById(id: number): Promise<DetallePedido | null> {
    return await DetallePedidoModel.getById(id);
  }

  async getDetallesByPedido(idPedido: number): Promise<DetallePedido[]> {
    return await DetallePedidoModel.getByPedido(idPedido);
  }

  async createDetallePedido(detalle: DetallePedido): Promise<number> {
    if (detalle.cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }
    return await DetallePedidoModel.create(detalle);
  }

  async updateDetallePedido(id: number, detalle: Partial<DetallePedido>): Promise<boolean> {
    if (detalle.cantidad !== undefined && detalle.cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }
    return await DetallePedidoModel.update(id, detalle);
  }

  async deleteDetallePedido(id: number): Promise<boolean> {
    return await DetallePedidoModel.delete(id);
  }
}
