import Testimonial from "../models/Testimonial.js";

/**
 * ADD TESTIMONIAL
 */
export const addTestimonial = async (req, res) => {
  try {
    const { clientName, company, testimonial, rating } = req.body;

    if (!clientName || !testimonial || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Client name, testimonial and rating are required",
      });
    }

    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 0 and 5",
      });
    }

    const newTestimonial = await Testimonial.create({
      clientName,
      company: company || "",
      testimonial,
      rating,
    });

    res.json({
      success: true,
      data: newTestimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPDATE TESTIMONIAL
 */
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientName, company, testimonial, rating } = req.body;

    const existing = await Testimonial.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    if (rating !== undefined && (rating < 0 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 0 and 5",
      });
    }

    existing.clientName = clientName ?? existing.clientName;
    existing.company = company ?? existing.company;
    existing.testimonial = testimonial ?? existing.testimonial;
    existing.rating = rating ?? existing.rating;

    await existing.save();

    res.json({
      success: true,
      data: existing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE TESTIMONIAL
 */
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    await testimonial.deleteOne();

    res.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET ALL TESTIMONIALS (ADMIN)
 */
export const getTestimonialsAdmin = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: testimonials.length ? testimonials : null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
