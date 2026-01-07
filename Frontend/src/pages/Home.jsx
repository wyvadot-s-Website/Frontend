import React, { useEffect, useState } from "react";
import ContactForm from "../components/ContactForm";
import ServiceComponent from "../components/service";
import ChooseImage from "../../public/Union.png";
import SecondHero from "../components/SecondHero";
import Shop from "../components/Shop";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { fetchHomeContent } from "../services/homeService";

function Home() {
  const navigate = useNavigate();
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeContent()
      .then(setHome)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null; // or spinner

  const handleClick = () => {
    navigate("/shop");
  };

  const handleService = () => {
    navigate("/services");
  };

  return (
    <div className="bg-white font-SF">
      <div className="bg-white pt-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative mb-10">
            <p className="absolute text-sm pl-2 lg:text-[40px] font-semibold max-w-[60%]">
               {home?.hero?.title}
            </p>
            <div
              className="h-[90vh] bg-cover bg-center bg-no-repeat"
              style={
                home?.hero?.backgroundImage?.url
                  ? { backgroundImage: `url(${home.hero.backgroundImage.url})` }
                  : {}
              }
            ></div>

            <p className="max-w-[20%] text-xs absolute -right-2 bottom-5 font-semibold text-sm">
              {home?.hero?.subtitle}
            </p>
            <div className="absolute bottom-10 left-10 flex gap-7">
              <Button
                onClick={handleClick}
                variant="outline"
                className="flex w-35 h-13 rounded-4xl font-outfit bg-gradient-to-tr from-[#FF8D28] to-[#9E4A00] text-white text-lg"
              >
                Shop with us
              </Button>
              <Button
                variant="outline"
                onClick={handleService}
                className="flex w-35 h-13 rounded-4xl bg-[#FFDDBE] font-outfit text-lg"
              >
                Book us now
              </Button>
            </div>
          </div>
          <div className=" flex font-geist">
            <div className="flex  font-geist">
              {home?.stats?.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl font-bold text-gray-900 mb-3">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-md font-medium leading-relaxed">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SecondHero />
      <ServiceComponent />

      <div className="flex flex-col gap-3 max-w-6xl mx-auto mb-20">
        <div className="flex justify-center lg:justify-start items-center gap-1 mb-2">
          <div className="flex w-5 h-1.5 bg-black rounded-lg place-self-center" />
          <p className="flex text-gray-600 text-md font-medium place-self-center">
            Our Company History
          </p>
        </div>
        <h2 className="text-5xl font-bold text-gray-900 mb-6">Why Choose Us</h2>
        <div className="flex-wrap lg:flex-nowrap flex w-full justify-between">
          <div className="flex-wrap lg:flex-nowrap flex w-full justify-between">
            {home?.whyChooseUs?.map((item) => (
              <div
                key={item._id}
                className="mb-8 bg-[#FAFAFA] rounded-lg p-3 max-w-[30%] border border-[#F1F5F966] flex flex-col gap-4"
              >
                <p className="text-2xl font-semibold">{item.title}</p>
                <p className="text-gray-600 font-normal text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <img
          src={ChooseImage}
          alt="A collage of construction workers and equipment"
          className="w-full h-full object-cover"
        />
      </div>

      <Shop />
      <ContactForm />
    </div>
  );
}

export default Home;
