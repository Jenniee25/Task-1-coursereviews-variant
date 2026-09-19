import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  getCourseSummary,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';

const router = Router();

// TODO: wire up the routes described in README.md section 3.
 router.post('/', createReview); 
 router.get('/', getAllReviews); 
 router.get('/summary', getCourseSummary); 
 router.get('/:id', getReview); 
 router.put('/:id', updateReview); 
 router.delete('/:id', deleteReview);
export default router;
