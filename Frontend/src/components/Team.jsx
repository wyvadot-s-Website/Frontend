import React, { useEffect, useState } from "react";
import { fetchTeam } from "@/services/teamService";

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTeam = async () => {
    try {
      const res = await fetchTeam();
      if (Array.isArray(res)) {
        setTeam(res);
      } else {
        setTeam([]);
      }
    } catch (error) {
      console.error("Failed to load team:", error);
      setTeam([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  if (loading) {
    return <p className="text-center">Loading team...</p>;
  }

  if (team.length === 0) {
    return <p className="text-center">No team members yet</p>;
  }

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900'>Our Team</h1>
    </div>
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
     
  {team.map((member) => (
    <div
      key={member._id}
      className="flex flex-col rounded-lg p-6 bg-[#F1F5F966]"
    >
      {/* Image with rounded corners */}
      <div className="relative w-full aspect-[4/3] mb-4">
        <img
          src={member.image?.url}
          alt={member.name}
          className="w-full h-full object-cover rounded-2xl "
        />
      </div>
      
      {/* Text content */}
      <div className="space-y-1">
        <h3 className="font-semibold text-lg text-gray-900">
          {member.name}
        </h3>
        <p className="text-sm text-gray-600 font-medium">
          {member.position}
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mt-3">
          {member.bio}
        </p>
      </div>
    </div>
  ))}
    </section>
    </>
  );
}
