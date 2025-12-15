import React from 'react';
import Image1 from "../../public/SH1.jpg"
import Image2 from "../../public/SH2.jpg"
import Image3 from "../../public/SH3.jpg"
import Image4 from "../../public/SH4.jpg"

function SecondHero() {
    return (
        <div className="bg-white pt-16 px-4 max-w-7xl mx-auto mt-20">
            <div className="max-w-6xl mx-auto flex items-center justify-center">
                <div className="relative gap-8 items-center">
                    {/* Left Column - Images */}
                        <div className="absolute h-45 w-60 aspect-square bg-gray-200 rounded-lg overflow-hidden left-0">
                            <img 
                                src={Image1}
                                alt="Industrial crane" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute h-45 w-60 aspect-square bg-gray-200 rounded-lg overflow-hidden right-0">
                            <img 
                                src={Image2} 
                                alt="Engineer with safety gear" 
                                className="w-full h-full object-cover"
                            />
                        </div>

                    {/* Center Column - Text */}
                    <div className="flex items-center justify-center text-center px-4 place-self-center ">
                        <p className="text-2xl md:text-4xl leading-relaxed text-gray-800 font-light w-[52%] font-semibold">
                            Wyvadot Projects & Resources Ltd is a fully Nigerian-owned company offering project management services, engineering, building/ facility maintenance, consultancy and human resourcing for both technical and non-technical projects and operations.
                        </p>
                    </div>

                    {/* Right Column - Images */}
                    <div className="absolute h-45 w-60 aspect-square bg-gray-200 rounded-lg overflow-hidden left-0 bottom-0">
                            <img 
                                src={Image3}
                                alt="Industrial equipment" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="h-45 w-60 aspect-square bg-gray-200 rounded-lg overflow-hidden absolute right-0 bottom-0">
                            <img 
                                src={Image4}
                                alt="Generator equipment" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                </div>
            </div>
        </div>
    );
}

export default SecondHero;