import { useEffect, useState } from "react";
import { fetchProjectsPublic } from "../services/projectService";

const ProjectHistory = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      const res = await fetchProjectsPublic();
      if (res?.success) {
        setProjects(res.data);
      }
    };
    loadProjects();
  }, []);

  if (projects.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-20 pt-5 pb-12 bg-white">
      <div className="max-w-7xl mx-auto space-y-16">
        {projects.map((project, index) => {
          const isReverse = index % 2 !== 0;
          
          return (
            <div
              key={project._id}
              className={`flex flex-col ${
                isReverse ? "md:flex-row-reverse" : "md:flex-row"
              } items-start gap-1 md:gap-12`}
            >
              {/* IMAGE */}
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={project.image.url}
                    alt={project.title}
                    className="w-full h-74 md:h-90 object-cover"
                  />
                </div>
              </div>

              {/* TEXT */}
              <div className="w-full md:w-1/2 space-y-3 mt-5">
                <h3 className="text-xl sm:text-4xl font-bold text-gray-900 leading-tight">
                  {project.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectHistory;