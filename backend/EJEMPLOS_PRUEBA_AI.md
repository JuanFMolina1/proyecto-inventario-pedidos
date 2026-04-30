# Ejemplos de Prueba del Endpoint de AI

Este archivo contiene ejemplos de cURL para probar el endpoint de AI.

## ⚠️ Prerequisitos

Antes de ejecutar estos ejemplos, asegúrate de:
1. Tener el servidor corriendo: `pnpm run dev`
2. Tener configurada tu `OPENAI_API_KEY` en el archivo `.env`
3. Tener datos en tu base de datos

## 🧪 Pruebas Básicas

### 1. Verificar estado del servicio

```bash
curl http://localhost:3000/api/ai/health
```

### 2. Obtener información del servicio

```bash
curl http://localhost:3000/api/ai/info
```

## 📊 Ejemplos de Consultas

### Consulta Simple: Listar Clientes

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Muéstrame todos los clientes\"}"
```

### Top 5 Clientes por Límite de Crédito

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"¿Cuáles son los 5 clientes con mayor límite de crédito?\"}"
```

### Análisis de Inventario

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"¿Qué artículos tienen menos de 10 unidades en existencia?\"}"
```

### Reporte de Pedidos

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Muéstrame los últimos 10 pedidos con información del cliente\"}"
```

### Estadísticas Generales

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Dame un resumen estadístico de la base de datos: número de clientes, artículos, fábricas y pedidos totales\"}"
```

### Análisis por Fábrica

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"¿Cuántos artículos diferentes provee cada fábrica y cuál es el valor total de su inventario?\"}"
```

### Clientes con Saldo Alto

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Muéstrame los clientes que tienen un saldo mayor a 50000 ordenados por saldo\"}"
```

### Análisis de Descuentos

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"¿Qué clientes tienen descuento mayor al 5% y cuál es su límite de crédito?\"}"
```

### Artículos Más Caros

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Dame los 10 artículos más caros con el nombre de la fábrica que los provee\"}"
```

### Análisis Complejo de Clientes

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Para cada cliente, muéstrame: nombre, número de pedidos realizados, número de direcciones registradas y crédito disponible (límite - saldo)\"}"
```

## ✏️ Ejemplos de Operaciones de Modificación

**⚠️ ADVERTENCIA**: Estas operaciones modifican la base de datos. Asegúrate de tener un backup antes de ejecutarlas.

### Insertar un Nuevo Cliente

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Agrega un nuevo cliente llamado 'Tech Solutions SA' con límite de crédito de 1500000, saldo 0 y descuento de 5%\"}"
```

### Insertar un Nuevo Artículo

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Crea un artículo llamado 'Mouse Inalámbrico Logitech' con descripción 'Mouse inalámbrico con conexión Bluetooth'\"}"
```

### Insertar una Nueva Fábrica

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Registra una nueva fábrica llamada 'Fábrica Norte' con teléfono '+56923456789'\"}"
```

### Actualizar Saldo de Cliente

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Actualiza el saldo del cliente con ID 5 a 75000\"}"
```

### Actualizar Existencias de Artículo

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Incrementa en 20 unidades las existencias del artículo con ID 3 en la fábrica con ID 2\"}"
```

### Actualizar Precio de Artículo

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Cambia el precio del artículo 1 en la fábrica 1 a 450000\"}"
```

### Actualizar Descuento de Cliente

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Actualiza el descuento del cliente 'Juan Pérez' a 10%\"}"
```

### Eliminar un Pedido

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Elimina el pedido con ID 15\"}"
```

### Eliminar una Dirección

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Borra la dirección con ID 8\"}"
```

### Eliminar Artículos con Stock Cero

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"Elimina de articulo_fabrica todos los registros que tengan 0 existencias\"}"
```

## 🔧 Para Windows PowerShell

Si estás usando PowerShell en Windows, usa esta sintaxis:

```powershell
$body = @{
    query = "¿Cuáles son los 5 clientes con mayor límite de crédito?"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/ai/query" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

## 📝 Usando un archivo para pruebas múltiples

Crea un archivo `test-queries.json`:

```json
{
  "queries": [
    "Muéstrame todos los clientes",
    "¿Cuántas fábricas tenemos?",
    "¿Qué artículos están agotados?",
    "Dame un reporte de pedidos del último mes"
  ]
}
```

Luego ejecuta cada query con un script (ejemplo en Node.js):

```javascript
const queries = require('./test-queries.json');

for (const query of queries.queries) {
  const response = await fetch('http://localhost:3000/api/ai/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  
  const result = await response.json();
  console.log('\n=== Query:', query);
  console.log('SQL:', result.sqlQuery);
  console.log('Response:', result.response);
  console.log('---\n');
}
```

## ✅ Respuestas Esperadas

Cada consulta exitosa devolverá:

```json
{
  "success": true,
  "query": "tu consulta original",
  "response": "Interpretación en lenguaje natural de los resultados",
  "sqlQuery": "SELECT ... (la consulta SQL generada)",
  "data": [...], // Los datos crudos de la consulta
  "timestamp": "2026-04-29T12:00:00.000Z"
}
```

## ❌ Manejo de Errores

### Consulta muy larga
```json
{
  "success": false,
  "error": "La consulta es demasiado larga. Máximo 2000 caracteres."
}
```

### Consulta vacía
```json
{
  "success": false,
  "error": "Se requiere una consulta de texto válida en el campo 'query'"
}
```

### Error de ejecución SQL
```json
{
  "success": false,
  "error": "Error al ejecutar la consulta SQL",
  "response": "Lo siento, ocurrió un error al procesar tu consulta."
}
```

## 🎯 Tips para Mejores Resultados

1. **Sé específico**: Mientras más clara sea tu pregunta, mejor será la respuesta
2. **Incluye contexto**: Menciona las tablas si las conoces ("de la tabla clientes...")
3. **Pide límites**: Usa "los 10 principales" en lugar de "todos" para consultas más rápidas
4. **Usa lenguaje natural**: No necesitas saber SQL, pregunta como le preguntarías a una persona
5. **Pide análisis**: Puedes pedir insights, promedios, totales, etc.
6. **Para operaciones de escritura**: Sé muy específico con los IDs y valores a modificar
7. **Backup primero**: Antes de hacer operaciones destructivas, asegúrate de tener un backup
8. **Verifica antes**: Usa consultas SELECT para verificar los datos antes de modificarlos

## ⚠️ Advertencias Importantes

- **Operaciones permanentes**: Las operaciones de INSERT, UPDATE y DELETE son permanentes
- **Sin confirmación**: No hay confirmación antes de ejecutar, la operación se realiza inmediatamente
- **Usa en producción con cuidado**: Considera usar este endpoint solo en entornos de desarrollo
- **Mantén backups**: Siempre mantén backups actualizados de tu base de datos

## 🚀 Próximos Pasos

Después de probar estos ejemplos:
1. Experimenta con tus propias preguntas (empezando con consultas SELECT)
2. Observa las consultas SQL generadas para aprender
3. Prueba operaciones de escritura en un entorno de desarrollo primero
4. Usa los resultados para generar reportes
5. Integra el endpoint en tu aplicación frontend
6. Considera agregar autenticación y autorización para producción
