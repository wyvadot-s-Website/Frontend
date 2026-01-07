import HomeContent from "../models/HomeContent.js";

export const getOrCreateHomeContent = async () => {
  let home = await HomeContent.findOne();

  if (!home) {
    home = await HomeContent.create({
      hero: {},
      stats: [
        { label: "Years of Combined Experience", value: "0+" },
        { label: "Projects Delivered", value: "0+" },
        { label: "Repeat Clients/Customer Retention", value: "0%" },
        { label: "On-Time Delivery Rate", value: "0%" }
      ],
      whyChooseUs: []
    });
  }

  return home;
};
