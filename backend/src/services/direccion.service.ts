import { DireccionModel, type Direccion } from '../models/direccion.model';

export class DireccionService {
  async getAllDirecciones(): Promise<Direccion[]> {
    return await DireccionModel.getAll();
  }

  async getDireccionById(id: number): Promise<Direccion | null> {
    return await DireccionModel.getById(id);
  }

  async getDireccionesByCliente(idCliente: number): Promise<Direccion[]> {
    return await DireccionModel.getByCliente(idCliente);
  }

  async createDireccion(direccion: Direccion): Promise<number> {
    if (!direccion.numero || !direccion.calle || !direccion.comuna || !direccion.ciudad) {
      throw new Error('Todos los campos de la dirección son requeridos');
    }
    return await DireccionModel.create(direccion);
  }

  async updateDireccion(id: number, direccion: Partial<Direccion>): Promise<boolean> {
    return await DireccionModel.update(id, direccion);
  }

  async deleteDireccion(id: number): Promise<boolean> {
    return await DireccionModel.delete(id);
  }
}
