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
    <section className="space-y-16">
      {projects.map((project, index) => {
        const isReverse = index % 2 !== 0;

        return (
          <div
            key={project._id}
            className={`flex flex-col md:flex-row ${
              isReverse ? "md:flex-row-reverse" : ""
            } items-center gap-8`}
          >
            {/* IMAGE */}
            <div className="w-full md:w-1/2">
              <img
                src={project.image.url}
                alt={project.title}
                className="w-full rounded-lg object-cover"
              />
            </div>

            {/* TEXT */}
            <div className="w-full md:w-1/2 space-y-4">
              <h3 className="text-2xl font-semibold">
                {project.title}
              </h3>
              <p className="text-gray-600">
                {project.description}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default ProjectHistory;
