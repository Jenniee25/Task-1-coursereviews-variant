import { Review } from '../models/Review.js';
import Joi from 'joi';
// TODO: write a validation schema for create/update per README.md section 2.
const createSchema = Joi.object({
courseCode: Joi.string().required(),
rating: Joi.number().integer().min(1).max(5).required(),


});

const updateSchema = Joi.object({

courseCode: Joi.string(),
rating: Joi.number().integer().min(1).max(5),


});
// GET /api/reviews
// TODO: implement per README.md section 3.
export async function getAllReviews(req, res, next) {
  try {
    // TODO
    const reviews = await Review.find()
  .populate('reviewedBy', 'name email')
  .sort({ createdAt: -1 })
  .lean();
    res.json({ reviews });
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
// TODO: implement per README.md sections 3 and 5.
export async function getReview(req, res, next) {
  try {
    // TODO
    const review = await Review.findById(req.params.id)
  .populate('reviewedBy', 'name email');

    if (!review) {
      return res.status(404).json({
        message: 'Review not found'
      });
    }

    res.json({ review });
  } catch (err) { next(err); }
}

// GET /api/reviews/summary?courseCode=CS101
// TODO: implement per README.md section 4.
export async function getCourseSummary(req, res, next) {
  try {
    const { courseCode } = req.query;

    if (!courseCode) {
      return res.status(400).json({
        message: 'courseCode is required'
      });
    }

    const result = await Review.aggregate([
      {
        $match: {
          courseCode: courseCode
        }
      },
      {
        $group: {
          _id: '$courseCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.json({
        courseCode,
        averageRating: 0,
        reviewCount: 0
      });
    }

    res.json({
      courseCode: result[0]._id,
      averageRating: Number(result[0].averageRating.toFixed(2)),
      reviewCount: result[0].reviewCount
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/reviews
// TODO: implement per README.md section 3.
export async function createReview(req, res, next) {
  try {
    // TODO
     const { value, error } = createSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }

    const review = await Review.create(value);

    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/reviews/:id
// TODO: implement per README.md sections 3 and 5.
export async function updateReview(req, res, next) {
  try {
    // TODO
    const { value, error } = updateSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }

    const doc = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: value },
      {
        new: true,
        runValidators: true
      }
    );

    if (!doc) {
      return res.status(404).json({
        message: 'Review not found'
      });
    }
res.json({ review: doc });
  } catch (err) { next(err); }
}

// DELETE /api/reviews/:id
// TODO: implement per README.md sections 3 and 5.
export async function deleteReview(req, res, next) {
  try {
    // TODO
    const doc = await Review.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({
        message: 'Review not found'
      });
    }

    res.json({ ok: true });
  } catch (err) { next(err); }
}
