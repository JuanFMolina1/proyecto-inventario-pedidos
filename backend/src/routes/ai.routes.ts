import { Router } from 'express';
import { queryAI, healthCheck, getInfo } from '../controllers/ai.controller';

const router = Router();

/**
 * POST /api/ai/query
 * Procesa una consulta en lenguaje natural sobre la base de datos
 */
router.post('/query', queryAI);

/**
 * GET /api/ai/health
 * Verifica el estado del servicio de AI
 */
router.get('/health', healthCheck);

/**
 * GET /api/ai/info
 * Obtiene información sobre el servicio
 */
router.get('/info', getInfo);

export default router;
