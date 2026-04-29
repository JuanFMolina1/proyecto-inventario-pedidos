import { ClienteModel, type Cliente } from '../models/cliente.model';

export class ClienteService {
  async getAllClientes(): Promise<Cliente[]> {
    return await ClienteModel.getAll();
  }

  async getClienteById(id: number): Promise<Cliente | null> {
    return await ClienteModel.getById(id);
  }

  async createCliente(cliente: Cliente): Promise<number> {
    // Validaciones de negocio
    if (cliente.limite_credito > 3000000) {
      throw new Error('El límite de crédito no puede exceder 3,000,000');
    }
    if (cliente.saldo < 0) {
      throw new Error('El saldo no puede ser negativo');
    }
    if (cliente.descuento < 0 || cliente.descuento > 100) {
      throw new Error('El descuento debe estar entre 0 y 100');
    }
    return await ClienteModel.create(cliente);
  }

  async updateCliente(id: number, cliente: Partial<Cliente>): Promise<boolean> {
    // Validaciones de negocio
    if (cliente.limite_credito && cliente.limite_credito > 3000000) {
      throw new Error('El límite de crédito no puede exceder 3,000,000');
    }
    if (cliente.saldo !== undefined && cliente.saldo < 0) {
      throw new Error('El saldo no puede ser negativo');
    }
    if (cliente.descuento !== undefined && (cliente.descuento < 0 || cliente.descuento > 100)) {
      throw new Error('El descuento debe estar entre 0 y 100');
    }
    return await ClienteModel.update(id, cliente);
  }

  async deleteCliente(id: number): Promise<boolean> {
    return await ClienteModel.delete(id);
  }
}
