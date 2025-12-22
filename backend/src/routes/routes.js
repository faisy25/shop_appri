import { Router } from 'express';
import productRoutes from '../modules/product/product.routes.js';
import mediaRoutes from '../modules/media/media.routes.js';

const router = Router();

router.use('/products', productRoutes);
router.use('/media', mediaRoutes);

export default router;
