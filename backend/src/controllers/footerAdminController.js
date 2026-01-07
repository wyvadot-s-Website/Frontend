import Footer from "../models/Footer.js";

// CREATE OR UPDATE FOOTER (ADMIN)
export const saveFooter = async (req, res) => {
  try {
    const footer = await Footer.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      data: footer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET FOOTER (ADMIN)
export const getFooterAdmin = async (req, res) => {
  try {
    const footer = await Footer.findOne();
    res.json({
      success: true,
      data: footer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
