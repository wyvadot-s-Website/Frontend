import React, { useEffect, useState } from "react";
import ContactForm from "../components/ContactForm";
import ServiceComponent from "../components/service";
import ChooseImage from "../../public/Union.png";
import SecondHero from "../components/SecondHero";
import Shop from "../components/Shop";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { fetchHomeContent } from "../services/homeService";
import { fetchAboutContent } from "../services/aboutService.js";

function Home() {
  const navigate = useNavigate();
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
     const [about, setAbout] = useState(null);

  useEffect(() => {
    fetchHomeContent()
      .then(setHome)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

    useEffect(() => {
      const loadAbout = async () => {
        const data = await fetchAboutContent();
        setAbout(data.data);
      };
      loadAbout();
    }, []);
  
    if (!about) return null;

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
        <div className="max-w-5xl mx-auto">
         <div className="relative w-full h-[90vh] rounded-2xl overflow-hidden mb-10">
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat "
    style={
      home?.hero?.backgroundImage?.url
        ? { backgroundImage: `url(${home.hero.backgroundImage.url})` }
        : { backgroundColor: '#1a1a1a' }
    }
  >
    {/* Dark Overlay for better text readability */}
    <div className="absolute inset-0 bg-black/50"></div>
  </div>

  {/* Content Container */}
  <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 gap-5">
    {/* Badge */}
    <div className="mb-6 bg-white backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg border border-white/30">
      <div className="flex -space-x-2">
        <div className="w-6 h-6 rounded-full bg-orange-400 border-2 border-white"></div>
        <div className="w-6 h-6 rounded-full bg-blue-400 border-2 border-white"></div>
        <div className="w-6 h-6 rounded-full bg-pink-400 border-2 border-white"></div>
      </div>
      <span className="text-sm font-medium text-gray-800">
        500+ Happy Customers
      </span>
    </div>

    {/* Main Heading */}
    <h1 className="text-4xl sm:text-5xl md:text-5xl font-semi-bold text-white text-center leading-tight mb-6 max-w-4xl">
      {home?.hero?.title || "Delivering World-Class Projects, Locally and Beyond."}
    </h1>

    {/* Subtitle */}
    <p className="text-base sm:text-lg md:text-xl text-white/90 text-center mb-8 max-w-2xl">
      {home?.hero?.subtitle || "Your trusted partner for engineering, construction, and project management success."}
    </p>

   {/* CTA Buttons */}
  <div className=" flex gap-7">
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
                className="flex w-35 h-13 rounded-4xl bg-white font-outfit text-lg"
              >
                Book us now
              </Button>
            </div>
  </div>
</div>
          <div className="flex font-geist items-center justify-center px-4">
  <div className="flex flex-col sm:flex-row font-geist w-full justify-evenly items-center sm:items-start gap-6 sm:gap-0">
    {home?.stats?.map((stat, index) => (
      <React.Fragment key={index}>
        <div className="text-center px-4 sm:px-6 w-full sm:w-auto">
          <div className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-2">
            {stat.value}
          </div>
          <div className="text-gray-500 text-sm font-normal leading-snug max-w-[200px] sm:max-w-[140px] mx-auto">
            {stat.label}
          </div>
        </div>
        {index < home.stats.length - 1 && (
          <div className="hidden sm:block h-16 w-[2px] bg-gray-200 self-center" />
        )}
        {index < home.stats.length - 1 && (
          <div className="block sm:hidden w-full max-w-[200px] h-[1px] bg-gray-200" />
        )}
      </React.Fragment>
    ))}
  </div>
</div>
        </div>
      </div>

       <SecondHero
          promiseText={about.promiseText}
          promiseImages={about.promiseImages}
        />
      <ServiceComponent />

      <div className="flex flex-col gap-3 max-w-6xl mx-auto mb-20 mt-10 px-4 sm:px-6">
  <div className="flex justify-center lg:justify-start items-center gap-1 mb-2">
    <div className="flex w-5 h-1.5 bg-black rounded-lg place-self-center" />
    <p className="flex text-gray-600 text-sm sm:text-md font-medium place-self-center">
      Our Company History
    </p>
  </div>
  
  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 text-center lg:text-left">
    Why Choose Us
  </h2>
  
  <div className="flex w-full justify-center items-center">
    <div className="flex flex-wrap lg:flex-nowrap w-full justify-center lg:justify-between gap-4 sm:gap-5">
      {home?.whyChooseUs?.map((item, index) => (
        <div
          key={item._id}
          className={`bg-[#FAFAFA] rounded-lg p-4 sm:p-5 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] border border-[#F1F5F966] flex flex-col gap-3 sm:gap-4 ${
            index === 0 && home?.whyChooseUs?.length === 1 ? 'lg:max-w-[400px]' : ''
          }`}
        >
          <p className="text-xl sm:text-2xl font-semibold">{item.title}</p>
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
    className="w-full h-auto object-cover rounded-lg mt-4 sm:mt-6"
  />
</div>

      <Shop />
      <ContactForm />
    </div>
  );
}

export default Home;
