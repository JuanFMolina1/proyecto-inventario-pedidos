import OpenAI from 'openai';
import pool from '../config/database';
import type { RowDataPacket } from 'mysql2';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface DatabaseSchema {
  tables: {
    name: string;
    columns: {
      name: string;
      type: string;
      nullable: string;
      key: string;
      default: string | null;
      extra: string;
    }[];
  }[];
}

/**
 * Obtiene el esquema completo de la base de datos
 */
async function getDatabaseSchema(): Promise<DatabaseSchema> {
  const connection = await pool.getConnection();
  
  try {
    // Obtener todas las tablas
    const [tables] = await connection.query<RowDataPacket[]>(
      'SHOW TABLES'
    );
    
    const schema: DatabaseSchema = { tables: [] };
    const dbName = process.env.DB_NAME || 'inventario_db';
    const tableKey = `Tables_in_${dbName}`;
    
    // Para cada tabla, obtener sus columnas
    for (const tableRow of tables) {
      const tableName = tableRow[tableKey];
      
      const [columns] = await connection.query<RowDataPacket[]>(
        'SHOW FULL COLUMNS FROM ??',
        [tableName]
      );
      
      schema.tables.push({
        name: tableName,
        columns: columns.map(col => ({
          name: col.Field,
          type: col.Type,
          nullable: col.Null,
          key: col.Key,
          default: col.Default,
          extra: col.Extra
        }))
      });
    }
    
    return schema;
  } finally {
    connection.release();
  }
}

/**
 * Ejecuta una consulta SQL (SELECT, INSERT, UPDATE, DELETE, etc.)
 */
async function executeSQLQuery(query: string): Promise<any> {
  const connection = await pool.getConnection();
  
  try {
    const [rows] = await connection.query(query);
    return rows;
  } finally {
    connection.release();
  }
}

/**
 * Formatea el esquema de la base de datos para el contexto del modelo
 */
function formatSchemaForContext(schema: DatabaseSchema): string {
  let formatted = 'ESQUEMA DE LA BASE DE DATOS:\n\n';
  
  for (const table of schema.tables) {
    formatted += `Tabla: ${table.name}\n`;
    formatted += 'Columnas:\n';
    
    for (const column of table.columns) {
      formatted += `  - ${column.name} (${column.type})`;
      if (column.key === 'PRI') formatted += ' [PRIMARY KEY]';
      if (column.key === 'MUL') formatted += ' [FOREIGN KEY]';
      if (column.nullable === 'NO') formatted += ' [NOT NULL]';
      formatted += '\n';
    }
    
    formatted += '\n';
  }
  
  return formatted;
}

/**
 * Procesa una consulta de texto usando OpenAI con contexto de la base de datos
 */
export async function processAIQuery(userQuery: string): Promise<{
  response: string;
  sqlQuery?: string;
  data?: any;
  error?: string;
}> {
  try {
    // Obtener el esquema de la base de datos
    const schema = await getDatabaseSchema();
    const schemaContext = formatSchemaForContext(schema);
    
    // Primera llamada: Generar la consulta SQL
    const sqlGenerationResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres un asistente experto en SQL y análisis de bases de datos. 
Tu tarea es ayudar a los usuarios a obtener información de una base de datos MySQL de inventario y pedidos.

${schemaContext}

REGLAS IMPORTANTES:
1. Puedes generar cualquier tipo de consulta SQL: SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER, etc.
2. Genera consultas SQL eficientes y optimizadas
3. Si la pregunta no está clara, haz tu mejor interpretación basada en el esquema
4. Usa JOIN cuando sea necesario para relacionar tablas
5. Respeta las restricciones y relaciones de la base de datos (claves foráneas, constraints)
6. Para operaciones de modificación, asegúrate de que sean coherentes con el esquema
7. Ten cuidado con operaciones destructivas como DROP o TRUNCATE

Cuando el usuario haga una pregunta, genera la consulta SQL necesaria.
Responde SOLO con la consulta SQL, sin explicaciones adicionales.`
        },
        {
          role: 'user',
          content: userQuery
        }
      ],
      temperature: 0.3
    });
    
    const sqlQuery = sqlGenerationResponse.choices[0]?.message?.content?.trim() || '';
    
    // Limpiar la consulta SQL (remover markdown si existe)
    let cleanedSqlQuery = sqlQuery
      .replace(/```sql\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    // Ejecutar la consulta SQL
    const queryResults = await executeSQLQuery(cleanedSqlQuery);
    
    // Segunda llamada: Interpretar y formatear los resultados
    const interpretationResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres un asistente experto en análisis de datos y operaciones de base de datos. 
Tu tarea es interpretar los resultados de operaciones SQL y presentarlos de manera clara y profesional en español.

Para consultas SELECT:
1. Proporciona un resumen ejecutivo de los resultados
2. Destaca insights o patrones importantes
3. Formatea los datos de manera legible
4. Ofrece recomendaciones si son aplicables

Para operaciones de modificación (INSERT, UPDATE, DELETE):
1. Confirma qué operación se realizó
2. Indica cuántos registros fueron afectados
3. Explica el impacto de la operación
4. Confirma el éxito de la operación

Para operaciones DDL (CREATE, ALTER, DROP):
1. Confirma qué cambio estructural se realizó
2. Explica el impacto en la base de datos

Sé conciso pero informativo y claro.`
        },
        {
          role: 'user',
          content: `Pregunta original: ${userQuery}

Consulta SQL ejecutada:
${cleanedSqlQuery}

Resultados obtenidos:
${JSON.stringify(queryResults, null, 2)}

Por favor, interpreta y presenta estos resultados de manera clara y profesional.`
        }
      ],
      temperature: 0.7
    });
    
    const interpretation = interpretationResponse.choices[0]?.message?.content || 'No se pudo generar una interpretación.';
    
    return {
      response: interpretation,
      sqlQuery: cleanedSqlQuery,
      data: queryResults
    };
    
  } catch (error: any) {
    console.error('Error en processAIQuery:', error);
    
    return {
      response: 'Lo siento, ocurrió un error al procesar tu consulta.',
      error: error.message || 'Error desconocido'
    };
  }
}

/**
 * Verifica la conexión con OpenAI
 */
export async function checkAIConnection(): Promise<boolean> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 5
    });
    
    return response.choices.length > 0;
  } catch (error) {
    console.error('Error al verificar conexión con OpenAI:', error);
    return false;
  }
}
