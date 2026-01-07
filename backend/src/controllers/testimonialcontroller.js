import Testimonial from "../models/Testimonial.js";

/**
 * GET ALL TESTIMONIALS (PUBLIC)
 */
export const getTestimonialsPublic = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .select("clientName company testimonial rating");

    if (!testimonials.length) {
      return res.json({
        success: true,
        data: [],
      });
    }

    res.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
