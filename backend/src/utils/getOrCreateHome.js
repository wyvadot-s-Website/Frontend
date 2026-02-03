import HomeContent from "../models/HomeContent.js";

export const getOrCreateHomeContent = async () => {
  let home = await HomeContent.findOne();

  if (!home) {
    home = await HomeContent.create({
      hero: {
        title: "",
        subtitle: "",
        backgroundImages: [],
      },
      stats: [
        { label: "Years of Combined Experience", value: "0+" },
        { label: "Projects Delivered", value: "0+" },
        { label: "Repeat Clients/Customer Retention", value: "0%" },
        { label: "On-Time Delivery Rate", value: "0%" }
      ],
      whyChooseUs: []
    });
  }

  // ✅ for older DB records that still have hero but not backgroundImages
  if (!home.hero) home.hero = {};
  if (!Array.isArray(home.hero.backgroundImages)) {
    home.hero.backgroundImages = [];
    await home.save();
  }

  return home;
};
