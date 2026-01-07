import Footer from "../models/Footer.js";

// GET FOOTER (PUBLIC)
export const getFooterPublic = async (req, res) => {
  try {
    const footer = await Footer.findOne();
    res.json(footer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
