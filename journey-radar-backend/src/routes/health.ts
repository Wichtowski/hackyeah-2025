import { Router } from 'express';

const router = Router();

router.get('/health', (_req, res) => {
  const ts = new Date().toISOString();
  console.log(`[health] OK ${ts}`);
  res.setHeader('x-health-check', ts);
  res.status(200).json({ message: 'ok from backend' });
});

export default router;
