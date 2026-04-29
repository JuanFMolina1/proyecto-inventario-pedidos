export function parseParam(param: string | string[] | undefined): string {
  if (typeof param === 'string') {
    return param;
  }
  if (Array.isArray(param) && param.length > 0) {
    return param[0];
  }
  throw new Error('Parámetro no válido');
}

export function parseIntParam(param: string | string[] | undefined): number {
  const value = parseParam(param);
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error('El parámetro debe ser un número');
  }
  return parsed;
}
