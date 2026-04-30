import type { Request, Response } from 'express';
import { processAIQuery, checkAIConnection } from '../services/ai.service';

/**
 * Endpoint principal para consultas de AI sobre la base de datos
 * POST /api/ai/query
 * Body: { query: string }
 */
export const queryAI = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;
    
    // Validar que se proporcione una consulta
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Se requiere una consulta de texto válida en el campo "query"'
      });
      return;
    }
    
    // Validar longitud máxima de la consulta
    if (query.length > 2000) {
      res.status(400).json({
        success: false,
        error: 'La consulta es demasiado larga. Máximo 2000 caracteres.'
      });
      return;
    }
    
    // Procesar la consulta con AI
    const result = await processAIQuery(query);
    
    // Si hay un error en el resultado
    if (result.error) {
      res.status(500).json({
        success: false,
        error: result.error,
        response: result.response
      });
      return;
    }
    
    // Respuesta exitosa
    res.status(200).json({
      success: true,
      query: query,
      response: result.response,
      sqlQuery: result.sqlQuery,
      data: result.data,
      queryType: result.queryType,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Error en queryAI:', error);
    
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message || 'Error desconocido'
    });
  }
};

/**
 * Endpoint para verificar el estado del servicio de AI
 * GET /api/ai/health
 */
export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    const isConnected = await checkAIConnection();
    
    res.status(200).json({
      success: true,
      status: isConnected ? 'operational' : 'degraded',
      openai: isConnected,
      configured: Boolean(process.env.OPENAI_API_KEY),
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    res.status(500).json({
      success: false,
      status: 'error',
      error: error.message || 'Error desconocido',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Endpoint para obtener información sobre el servicio
 * GET /api/ai/info
 */
export const getInfo = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    service: 'AI Query Service',
    version: '1.0.0',
    description: 'Servicio de consultas a la base de datos usando OpenAI con contexto del esquema de base de datos (MCP)',
    endpoints: {
      query: {
        method: 'POST',
        path: '/api/ai/query',
        description: 'Envía una consulta en lenguaje natural para interactuar con la base de datos (consultas, inserciones, actualizaciones, eliminaciones, etc.)',
        body: {
          query: 'string (requerido, máx. 2000 caracteres)'
        },
        example: {
          query: '¿Cuáles son los 5 clientes con mayor límite de crédito?'
        }
      },
      health: {
        method: 'GET',
        path: '/api/ai/health',
        description: 'Verifica el estado del servicio de AI'
      },
      info: {
        method: 'GET',
        path: '/api/ai/info',
        description: 'Obtiene información sobre el servicio'
      }
    },
    features: [
      'Consultas en lenguaje natural',
      'Generación automática de SQL',
      'Interpretación inteligente de resultados',
      'Operaciones completas de base de datos (SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP)',
      'Contexto completo del esquema de base de datos',
      'Validación básica de sentencias múltiples',
      'Verificación de conexión con OpenAI'
    ],
    security: {
      readOnly: false,
      allowedOperations: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'TRUNCATE'],
      note: 'El modelo tiene acceso completo a la base de datos. Usar con precaución.'
    },
    configuration: {
      configured: Boolean(process.env.OPENAI_API_KEY),
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
    }
  });
};
