import { FabricaModel, type Fabrica } from '../models/fabrica.model';

export class FabricaService {
  async getAllFabricas(): Promise<Fabrica[]> {
    return await FabricaModel.getAll();
  }

  async getFabricaById(id: number): Promise<Fabrica | null> {
    return await FabricaModel.getById(id);
  }

  async createFabrica(fabrica: Fabrica): Promise<number> {
    if (!fabrica.nombre || fabrica.nombre.trim() === '') {
      throw new Error('El nombre de la fábrica es requerido');
    }
    if (!fabrica.telefono || fabrica.telefono.trim() === '') {
      throw new Error('El teléfono de la fábrica es requerido');
    }
    return await FabricaModel.create(fabrica);
  }

  async updateFabrica(id: number, fabrica: Partial<Fabrica>): Promise<boolean> {
    if (fabrica.nombre !== undefined && fabrica.nombre.trim() === '') {
      throw new Error('El nombre de la fábrica no puede estar vacío');
    }
    if (fabrica.telefono !== undefined && fabrica.telefono.trim() === '') {
      throw new Error('El teléfono de la fábrica no puede estar vacío');
    }
    return await FabricaModel.update(id, fabrica);
  }

  async deleteFabrica(id: number): Promise<boolean> {
    return await FabricaModel.delete(id);
  }
}
