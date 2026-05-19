import { Folder } from "lucide-react";
import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
    return (
        <Link
            to={`/tasks?project=${project.projectCode}`}
            className="project-card"
        >
            <Folder size={35} />

            <div>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
            </div>
        </Link>
    );
    
};

export default ProjectCard;