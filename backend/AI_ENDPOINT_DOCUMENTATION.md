# Endpoint de AI con OpenAI y MCP DBHub

Este documento describe el nuevo endpoint de AI que permite realizar consultas en lenguaje natural sobre la base de datos de inventario y pedidos.

## 📋 Características

- **Consultas en Lenguaje Natural**: Pregunta en español sobre los datos de tu base de datos
- **Generación Automática de SQL**: El modelo genera consultas SQL basadas en tu pregunta
- **Contexto Completo**: El modelo tiene acceso al esquema completo de la base de datos (MCP - Model Context Protocol)
- **Operaciones Completas**: Permite SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP y todas las operaciones SQL
- **Interpretación Inteligente**: Los resultados se interpretan y presentan de manera clara

## 🔧 Configuración

### 1. Variables de Entorno

Asegúrate de tener configuradas las siguientes variables en tu archivo `.env`:

```env
# Conexión a la Base de Datos
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=inventario_db

# API Key de OpenAI
OPENAI_API_KEY=sk-tu-api-key-aqui

# Modelo opcional para usar con el servicio de IA
OPENAI_MODEL=gpt-4o-mini
```

### 2. Obtener API Key de OpenAI

1. Ve a [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Inicia sesión o crea una cuenta
3. Crea una nueva API Key
4. Copia la key y agrégala a tu archivo `.env`

### 3. Dependencias

Las siguientes dependencias ya fueron instaladas:

- `openai@6.35.0` - SDK oficial de OpenAI
- `@modelcontextprotocol/sdk@1.29.0` - SDK para Model Context Protocol

## 🚀 Uso del Endpoint

### Información del Servicio

```http
GET /api/ai/info
```

Retorna información completa sobre el servicio, endpoints disponibles, características y medidas de seguridad.

**Respuesta:**
```json
{
  "success": true,
  "service": "AI Query Service",
  "version": "1.0.0",
  "description": "Servicio de consultas a la base de datos usando OpenAI con contexto del esquema de base de datos (MCP)",
  "endpoints": {...},
  "features": [...],
  "security": {...}
}
```

### Estado del Servicio

```http
GET /api/ai/health
```

Verifica que el servicio de OpenAI esté operativo.

**Respuesta:**
```json
{
  "success": true,
  "status": "operational",
  "openai": true,
  "configured": true,
  "model": "gpt-4o-mini",
  "timestamp": "2026-04-29T12:00:00.000Z"
}
```

### Consulta de AI

```http
POST /api/ai/query
Content-Type: application/json

{
  "query": "¿Cuáles son los 5 clientes con mayor límite de crédito?"
}
```

**Parámetros:**
- `query` (string, requerido): Consulta en lenguaje natural (máximo 2000 caracteres)

**Respuesta Exitosa:**
```json
{
  "success": true,
  "query": "¿Cuáles son los 5 clientes con mayor límite de crédito?",
  "response": "# Análisis de Clientes con Mayor Límite de Crédito\n\nLos 5 clientes con mayor límite de crédito son:\n\n1. **Juan Pérez** - Límite: $3,000,000.00\n2. **María García** - Límite: $2,800,000.00\n...",
  "sqlQuery": "SELECT nombre, limite_credito FROM clientes ORDER BY limite_credito DESC LIMIT 5",
  "queryType": "SELECT",
  "data": [
    {
      "nombre": "Juan Pérez",
      "limite_credito": 3000000.00
    }
  ],
  "timestamp": "2026-04-29T12:00:00.000Z"
}
```

**Respuesta de Error:**
```json
{
  "success": false,
  "error": "Error al ejecutar la consulta SQL",
  "response": "Lo siento, ocurrió un error al procesar tu consulta."
}
```

## 📝 Ejemplos de Consultas

### Reportes de Clientes

```json
{
  "query": "Muéstrame los clientes que tienen un saldo mayor a 100,000 y ordénalos por saldo descendente"
}
```

```json
{
  "query": "¿Cuántos clientes tenemos en total y cuál es el promedio de su límite de crédito?"
}
```

### Reportes de Inventario

```json
{
  "query": "¿Qué artículos tienen menos de 10 unidades en existencia en alguna fábrica?"
}
```

```json
{
  "query": "Dame un reporte de los artículos más caros por fábrica"
}
```

### Reportes de Pedidos

```json
{
  "query": "Muéstrame los últimos 10 pedidos realizados con información del cliente y fecha"
}
```

```json
{
  "query": "¿Cuáles son los artículos más pedidos en el último mes?"
}
```

### Análisis Complejos

```json
{
  "query": "Necesito un reporte que muestre por cada cliente: su nombre, cuántos pedidos ha realizado, el total de artículos pedidos y su límite de crédito disponible"
}
```

```json
{
  "query": "Dame un análisis de las fábricas mostrando cuántos artículos diferentes provee cada una y el valor total de su inventario"
}
```

## 🔒 Consideraciones de Seguridad

**⚠️ IMPORTANTE: El endpoint tiene acceso completo a la base de datos**

1. **Operaciones Completas**: El modelo puede ejecutar cualquier operación SQL:
   - SELECT (consultas)
   - INSERT (inserciones)
   - UPDATE (actualizaciones)
   - DELETE (eliminaciones)
   - DROP, TRUNCATE (eliminación de tablas/datos)
   - ALTER, CREATE (modificación de estructura)

2. **Validación de Entrada**: 
   - Longitud máxima de 2000 caracteres
   - Validación de tipo de datos

3. **Recomendaciones de Seguridad**:
   - Mantener backups regulares de la base de datos
   - Usar el endpoint con precaución en entornos de producción
   - Considerar implementar autenticación y autorización
   - Registrar (log) todas las operaciones realizadas
   - Revisar las consultas generadas antes de ejecutarlas en producción

4. **Timeout de Conexión**: Uso de pool de conexiones con límites configurados

## 🏗️ Arquitectura

### Model Context Protocol (MCP)

El servicio implementa MCP para proveer contexto completo al modelo de IA:

1. **Obtención de Esquema**: Se consulta dinámicamente el esquema de la base de datos
2. **Formateo de Contexto**: El esquema se formatea en un texto legible para el modelo
3. **Contexto Persistente**: El modelo tiene acceso a:
   - Nombres de todas las tablas
   - Columnas de cada tabla con sus tipos
   - Claves primarias y foráneas
   - Constraints y validaciones

### Flujo de Trabajo

```
Usuario → Query en Lenguaje Natural
    ↓
Endpoint /api/ai/query
    ↓
AI Service obtiene esquema DB (MCP)
    ↓
OpenAI genera SQL basado en esquema y query
    ↓
Ejecución de SQL (SELECT, INSERT, UPDATE, DELETE, etc.)
    ↓
OpenAI interpreta resultados
    ↓
Respuesta formateada al usuario
```

## 🛠️ Integración

### Desde JavaScript/TypeScript

```typescript
const response = await fetch('http://localhost:3000/api/ai/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: '¿Cuáles son los clientes con mayor descuento?'
  })
});

const data = await response.json();
console.log(data.response);
console.log('SQL ejecutado:', data.sqlQuery);
console.log('Datos:', data.data);
```

### Desde cURL

```bash
curl -X POST http://localhost:3000/api/ai/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Muéstrame los 10 artículos más caros"}'
```

### Desde Python

```python
import requests

response = requests.post(
    'http://localhost:3000/api/ai/query',
    json={'query': '¿Qué fábricas tienen más de 5 artículos?'}
)

result = response.json()
print(result['response'])
print('SQL:', result['sqlQuery'])
```

## 📊 Modelo Utilizado

- **Modelo**: GPT-4o-mini
- **Temperatura**: 
  - 0.3 para generación de SQL (más preciso)
  - 0.7 para interpretación de resultados (más creativo)
- **Proveedor**: OpenAI

## ⚠️ Limitaciones

1. **Límite de caracteres**: La consulta no puede exceder 2000 caracteres
2. **Costos de API**: Cada consulta consume tokens de tu cuenta de OpenAI
3. **Latencia**: La respuesta puede tomar varios segundos dependiendo de la complejidad
4. **Responsabilidad**: Las operaciones de modificación/eliminación son permanentes - usar con precaución

## 🔍 Troubleshooting

### Error: "OPENAI_API_KEY no configurada"

**Solución**: Asegúrate de tener la variable `OPENAI_API_KEY` en tu archivo `.env`

### Error: "Error al ejecutar la consulta SQL"

**Solución**: Puede haber un error de sintaxis SQL o una violación de restricciones. Revisa el mensaje de error específico y reformula tu pregunta.

### Error: "The tool simplified the command"

**Solución**: Esto no es un error, solo un aviso informativo del sistema.

### Error de conexión a la base de datos

**Solución**: Verifica que las variables `DB_HOST`, `DB_USER`, `DB_PASSWORD` y `DB_NAME` estén correctamente configuradas y que el servidor MySQL esté ejecutándose.

## 📚 Recursos Adicionales

- [Documentación de OpenAI API](https://platform.openai.com/docs)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [MySQL2 para Node.js](https://github.com/sidorares/node-mysql2)

---

**Versión**: 1.0.0  
**Última actualización**: Abril 29, 2026
