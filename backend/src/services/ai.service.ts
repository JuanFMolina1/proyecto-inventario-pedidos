import OpenAI from 'openai'
import type { RowDataPacket } from 'mysql2'
import pool from '../config/database'

const aiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface DatabaseColumn {
  name: string
  type: string
  nullable: string
  key: string
  default: string | null
  extra: string
  comment: string
}

interface DatabaseConstraint {
  name: string
  type: string
}

interface DatabaseForeignKey {
  name: string
  columnName: string
  referencedTable: string
  referencedColumn: string
  updateRule: string
  deleteRule: string
}

interface DatabaseIndex {
  name: string
  columns: string[]
  unique: boolean
}

interface DatabaseTable {
  name: string
  engine: string
  comment: string
  columns: DatabaseColumn[]
  constraints: DatabaseConstraint[]
  foreignKeys: DatabaseForeignKey[]
  indexes: DatabaseIndex[]
}

interface DatabaseSchema {
  database: string
  tables: DatabaseTable[]
}

function formatDefaultValue(value: unknown): string {
  if (value === null || value === undefined) {
    return 'NULL'
  }

  if (typeof value === 'string') {
    return value.length > 0 ? value : "''"
  }

  return String(value)
}

async function getActiveDatabaseName(connection: Awaited<ReturnType<typeof pool.getConnection>>): Promise<string> {
  const [rows] = await connection.query<RowDataPacket[]>('SELECT DATABASE() AS database_name')
  return String(rows[0]?.database_name ?? process.env.DB_NAME ?? '').trim()
}

/**
 * Obtiene el esquema completo de la base de datos con columnas, constraints,
 * claves foráneas e índices, para darle al modelo un contexto real del dominio.
 */
async function getDatabaseSchema(): Promise<DatabaseSchema> {
  const connection = await pool.getConnection()

  try {
    const databaseName = await getActiveDatabaseName(connection)

    if (!databaseName) {
      throw new Error('No se pudo determinar la base de datos activa.')
    }

    const [tables] = await connection.query<RowDataPacket[]>(
      `
        SELECT TABLE_NAME, ENGINE, TABLE_COMMENT
        FROM information_schema.TABLES
        WHERE TABLE_SCHEMA = ?
        ORDER BY TABLE_NAME
      `,
      [databaseName],
    )

    const schema: DatabaseSchema = {
      database: databaseName,
      tables: [],
    }

    for (const tableRow of tables) {
      const tableName = String(tableRow.TABLE_NAME)

      const [columns] = await connection.query<RowDataPacket[]>(
        `
          SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY, COLUMN_DEFAULT, EXTRA, COLUMN_COMMENT
          FROM information_schema.COLUMNS
          WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
          ORDER BY ORDINAL_POSITION
        `,
        [databaseName, tableName],
      )

      const [constraints] = await connection.query<RowDataPacket[]>(
        `
          SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE
          FROM information_schema.TABLE_CONSTRAINTS
          WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
          ORDER BY CONSTRAINT_NAME
        `,
        [databaseName, tableName],
      )

      const [foreignKeys] = await connection.query<RowDataPacket[]>(
        `
          SELECT
            kcu.CONSTRAINT_NAME,
            kcu.COLUMN_NAME,
            kcu.REFERENCED_TABLE_NAME,
            kcu.REFERENCED_COLUMN_NAME,
            rc.UPDATE_RULE,
            rc.DELETE_RULE
          FROM information_schema.KEY_COLUMN_USAGE kcu
          INNER JOIN information_schema.REFERENTIAL_CONSTRAINTS rc
            ON rc.CONSTRAINT_SCHEMA = kcu.CONSTRAINT_SCHEMA
           AND rc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
          WHERE kcu.TABLE_SCHEMA = ?
            AND kcu.TABLE_NAME = ?
            AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
          ORDER BY kcu.ORDINAL_POSITION
        `,
        [databaseName, tableName],
      )

      const [indexes] = await connection.query<RowDataPacket[]>(
        `
          SELECT INDEX_NAME, COLUMN_NAME, NON_UNIQUE, SEQ_IN_INDEX
          FROM information_schema.STATISTICS
          WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
          ORDER BY INDEX_NAME, SEQ_IN_INDEX
        `,
        [databaseName, tableName],
      )

      const groupedIndexes = new Map<string, DatabaseIndex>()

      for (const indexRow of indexes) {
        const indexName = String(indexRow.INDEX_NAME)
        const current = groupedIndexes.get(indexName)

        if (!current) {
          groupedIndexes.set(indexName, {
            name: indexName,
            columns: [String(indexRow.COLUMN_NAME)],
            unique: Number(indexRow.NON_UNIQUE) === 0,
          })
          continue
        }

        current.columns.push(String(indexRow.COLUMN_NAME))
      }

      schema.tables.push({
        name: tableName,
        engine: String(tableRow.ENGINE ?? ''),
        comment: String(tableRow.TABLE_COMMENT ?? ''),
        columns: columns.map((column) => ({
          name: String(column.COLUMN_NAME),
          type: String(column.COLUMN_TYPE),
          nullable: String(column.IS_NULLABLE),
          key: String(column.COLUMN_KEY ?? ''),
          default: column.COLUMN_DEFAULT === null ? null : String(column.COLUMN_DEFAULT),
          extra: String(column.EXTRA ?? ''),
          comment: String(column.COLUMN_COMMENT ?? ''),
        })),
        constraints: constraints.map((constraint) => ({
          name: String(constraint.CONSTRAINT_NAME),
          type: String(constraint.CONSTRAINT_TYPE),
        })),
        foreignKeys: foreignKeys.map((foreignKey) => ({
          name: String(foreignKey.CONSTRAINT_NAME),
          columnName: String(foreignKey.COLUMN_NAME),
          referencedTable: String(foreignKey.REFERENCED_TABLE_NAME),
          referencedColumn: String(foreignKey.REFERENCED_COLUMN_NAME),
          updateRule: String(foreignKey.UPDATE_RULE),
          deleteRule: String(foreignKey.DELETE_RULE),
        })),
        indexes: Array.from(groupedIndexes.values()),
      })
    }

    return schema
  } finally {
    connection.release()
  }
}

/**
 * Convierte el esquema a un texto útil para contexto del modelo.
 */
function formatSchemaForContext(schema: DatabaseSchema): string {
  let formatted = `BASE DE DATOS ACTIVA: ${schema.database}\n\n`

  for (const table of schema.tables) {
    formatted += `TABLA: ${table.name}\n`

    if (table.comment) {
      formatted += `Comentario: ${table.comment}\n`
    }

    if (table.engine) {
      formatted += `Motor: ${table.engine}\n`
    }

    formatted += 'Columnas:\n'

    for (const column of table.columns) {
      const flags: string[] = []

      if (column.key === 'PRI') flags.push('PRIMARY KEY')
      if (column.key === 'UNI') flags.push('UNIQUE')
      if (column.key === 'MUL') flags.push('INDEX')
      if (column.nullable === 'NO') flags.push('NOT NULL')
      if (column.extra) flags.push(column.extra)
      if (column.comment) flags.push(`COMMENT: ${column.comment}`)

      const suffix = flags.length > 0 ? ` [${flags.join(' | ')}]` : ''
      formatted += `  - ${column.name} (${column.type})${suffix}\n`

      if (column.default !== null && column.default !== undefined) {
        formatted += `    Default: ${formatDefaultValue(column.default)}\n`
      }
    }

    if (table.constraints.length > 0) {
      formatted += 'Constraints:\n'

      for (const constraint of table.constraints) {
        formatted += `  - ${constraint.name} (${constraint.type})\n`
      }
    }

    if (table.foreignKeys.length > 0) {
      formatted += 'Claves foráneas:\n'

      for (const foreignKey of table.foreignKeys) {
        formatted += `  - ${foreignKey.name}: ${foreignKey.columnName} -> ${foreignKey.referencedTable}.${foreignKey.referencedColumn} [ON UPDATE ${foreignKey.updateRule}, ON DELETE ${foreignKey.deleteRule}]\n`
      }
    }

    if (table.indexes.length > 0) {
      formatted += 'Índices:\n'

      for (const index of table.indexes) {
        formatted += `  - ${index.name}: ${index.columns.join(', ')}${index.unique ? ' [UNIQUE]' : ''}\n`
      }
    }

    formatted += '\n'
  }

  return formatted
}

function normalizeSqlQuery(rawQuery: string): string {
  let query = rawQuery.trim()

  const fencedBlock = query.match(/```(?:sql)?\s*([\s\S]*?)```/i)
  if (fencedBlock?.[1]) {
    query = fencedBlock[1].trim()
  }

  query = query.replace(/^SQL\s*:\s*/i, '').trim()

  if (query.endsWith(';')) {
    query = query.slice(0, -1).trim()
  }

  return query
}

function getSqlCommand(query: string): string {
  const firstToken = query.trim().split(/\s+/)[0] || ''
  return firstToken.toUpperCase()
}

function hasMultipleStatements(query: string): boolean {
  const withoutTrailingSemicolon = query.replace(/;\s*$/, '')
  return /;/.test(withoutTrailingSemicolon)
}

/**
 * Ejecuta una consulta SQL generada por el modelo.
 */
async function executeSQLQuery(query: string): Promise<unknown> {
  const connection = await pool.getConnection()

  try {
    const [rows] = await connection.query(query)
    return rows
  } finally {
    connection.release()
  }
}

/**
 * Procesa una consulta de texto usando OpenAI con contexto de la base de datos.
 */
export async function processAIQuery(userQuery: string): Promise<{
  response: string
  sqlQuery?: string
  data?: unknown
  queryType?: string
  error?: string
}> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        response: 'La API de OpenAI no está configurada en el backend.',
        error: 'OPENAI_API_KEY no configurada',
      }
    }

    const schema = await getDatabaseSchema()
    const schemaContext = formatSchemaForContext(schema)

    const sqlGenerationResponse = await openai.chat.completions.create({
      model: aiModel,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: `Eres un asistente experto en SQL para una base de datos MySQL de inventario y pedidos.

${schemaContext}

Reglas:
1. Genera una sola consulta SQL por respuesta.
2. Usa exclusivamente el esquema provisto.
3. Si necesitas unir tablas, usa JOIN explícitos.
4. Respeta las relaciones, restricciones y tipos de datos.
5. No agregues explicaciones, títulos ni bloques de código.
6. Devuelve únicamente SQL válido para MySQL.`
        },
        {
          role: 'user',
          content: userQuery,
        },
      ],
    })

    const sqlQuery = normalizeSqlQuery(sqlGenerationResponse.choices[0]?.message?.content || '')

    if (!sqlQuery) {
      return {
        response: 'No se pudo generar una consulta SQL válida.',
        error: 'SQL vacío',
      }
    }

    if (hasMultipleStatements(sqlQuery)) {
      return {
        response: 'La consulta generada contiene múltiples sentencias y fue bloqueada por seguridad.',
        error: 'Múltiples sentencias no permitidas',
      }
    }

    const queryType = getSqlCommand(sqlQuery)
    const queryResults = await executeSQLQuery(sqlQuery)

    const interpretationResponse = await openai.chat.completions.create({
      model: aiModel,
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content: `Eres un asistente de análisis de datos. Explica los resultados de consultas MySQL en español, con claridad y sin inventar datos.

Si la operación fue SELECT:
- Resume el hallazgo principal.
- Señala patrones importantes.
- Presenta el resultado con formato legible.

Si fue INSERT, UPDATE o DELETE:
- Indica qué cambió.
- Menciona cuántos registros fueron afectados si el resultado lo permite.

Si fue CREATE, ALTER o DROP:
- Explica el cambio estructural.

Sé conciso, preciso y profesional.`,
        },
        {
          role: 'user',
          content: `Consulta original:
${userQuery}

SQL ejecutado:
${sqlQuery}

Tipo de operación:
${queryType}

Resultado devuelto por MySQL:
${JSON.stringify(queryResults, null, 2)}`,
        },
      ],
    })

    const interpretation =
      interpretationResponse.choices[0]?.message?.content ||
      'No se pudo generar una interpretación.'

    return {
      response: interpretation,
      sqlQuery,
      data: queryResults,
      queryType,
    }
  } catch (error: any) {
    console.error('Error en processAIQuery:', error)

    return {
      response: 'Lo siento, ocurrió un error al procesar tu consulta.',
      error: error?.message || 'Error desconocido',
    }
  }
}

/**
 * Verifica la conexión con OpenAI.
 */
export async function checkAIConnection(): Promise<boolean> {
  if (!process.env.OPENAI_API_KEY) {
    return false
  }

  try {
    const response = await openai.chat.completions.create({
      model: aiModel,
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 5,
    })

    return response.choices.length > 0
  } catch (error) {
    console.error('Error al verificar conexión con OpenAI:', error)
    return false
  }
}
