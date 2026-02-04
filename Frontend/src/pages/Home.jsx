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
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import image1 from "../../public/6ce65edd3fe199d15a1a3b3cec6faeec5ba9e8ce.png"
import image2 from "../../public/733a1fa5964692a927dc20b6a0b74974823367a8.png"
import image3 from "../../public/21ac43fe069af5d46cccba0f640e45e8116eff60.png"

const settings = {
  dots: true,
  infinite: true,
  speed: 700,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4500,
  fade: true,
  cssEase: 'linear'
};

function Home() {
  const navigate = useNavigate();
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [about, setAbout] = useState(null);

  const [activeBg, setActiveBg] = useState(0);

  // ✅ derive slider images safely (OUTSIDE JSX)
  const bgImages = home?.hero?.backgroundImages || [];
  const currentBgUrl = bgImages[activeBg]?.url;

  // ✅ rotate background
  useEffect(() => {
    if (!bgImages.length) return;

    const t = setInterval(() => {
      setActiveBg((prev) => (prev + 1) % bgImages.length);
    }, 4500);

    return () => clearInterval(t);
  }, [bgImages.length]);

  // ✅ reset index when new home content arrives (prevents out-of-range)
  useEffect(() => {
    setActiveBg(0);
  }, [bgImages.length]);

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
        <div className="max-w-6xl mx-auto">
          <div className="relative w-full h-[90vh] rounded-2xl overflow-hidden mb-10">
         {/* Background Slider - Enhanced */}
<div className="absolute inset-0">
  {bgImages.map((img, idx) => (
    <div
      key={idx}
      className={`absolute inset-0 transition-opacity duration-1000 ${
        idx === activeBg ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${img.url})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
    </div>
  ))}
  
  {/* Fallback */}
  {bgImages.length === 0 && (
    <div className="absolute inset-0 bg-[#1a1a1a]">
      <div className="absolute inset-0 bg-black/50"></div>
    </div>
  )}
</div>



{/* Pagination Dots */}
{bgImages.length > 1 && (
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
    {bgImages.map((_, idx) => (
      <button
        key={idx}
        onClick={() => setActiveBg(idx)}
        className={`h-2 rounded-full transition-all ${
          idx === activeBg ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/70'
        }`}
        aria-label={`Go to slide ${idx + 1}`}
      />
    ))}
  </div>
)}

            {/* Content Container */}
            <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 gap-5">
              {/* Badge */}
              <div className="mb-6 bg-white backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg border border-white/30">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full border-2 border-white">
                    <img src={image1} alt="" srcset="" className='w-full h-full object-cover rounded-full'/>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white">
                    <img src={image3} alt="" srcset="" className='w-full h-full object-cover rounded-full'/>
                  </div>
                  <div className="w-10 h-10 rounded-full  border-2 border-white">
                    <img src={image2} alt="" srcset="" className='w-full h-full object-cover rounded-full'/>
                  </div>
                </div>
                <span className="text-lg font-medium text-gray-800">
                  500+ Happy Customers
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-5xl font-semi-bold text-white text-center leading-tight mb-6 max-w-4xl">
                {home?.hero?.title ||
                  "Delivering World-Class Projects, Locally and Beyond."}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg md:text-xl text-white/90 text-center mb-8 max-w-2xl">
                {home?.hero?.subtitle ||
                  "Your trusted partner for engineering, construction, and project management success."}
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
                  index === 0 && home?.whyChooseUs?.length === 1
                    ? "lg:max-w-[400px]"
                    : ""
                }`}
              >
                <p className="text-xl sm:text-2xl font-semibold">
                  {item.title}
                </p>
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
