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
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {team.map((member) => (
        <div
          key={member._id}
          className="border rounded-lg p-4 text-center"
        >
          <img
            src={member.image?.url}
            alt={member.name}
            className="w-32 h-32 mx-auto rounded-full object-cover"
          />

          <h3 className="mt-4 font-semibold">{member.name}</h3>
          <p className="text-sm text-gray-500">{member.position}</p>
          <p className="text-sm text-gray-700 mt-2">{member.bio}</p>
        </div>
      ))}
    </section>
  );
}
