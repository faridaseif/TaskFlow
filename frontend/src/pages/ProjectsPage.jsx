import React, { useState } from "react";
import { Link } from "react-router-dom";
import useProjects from "../hooks/useProjects";
import { useAuth } from "../context/AuthContext";
import ProjectList from "../components/ProjectList";
import { Search, Plus } from "lucide-react";
import "./ProjectsPage.css";

const ProjectsPage = () => {
    const { projects } = useProjects();
    const { currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    const userProjects = projects?.filter(project => {
        const isManager = project.manager && currentUser && (
            (project.manager.id && String(project.manager.id) === String(currentUser.id)) ||
            (project.manager.email && project.manager.email === currentUser.email)
        );
        const isMember = project.members && currentUser && project.members.some(m => 
            (m.id && String(m.id) === String(currentUser.id)) ||
            (m.email && m.email === currentUser.email)
        );
        return isManager || isMember;
    });

    const filteredProjects = userProjects?.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="projects-page">
            <div className="page-header">
                <div>
                    <h1 className="text-h1">Projects</h1>
                    <p className="text-muted">{projects?.length || 0} projects in workspace</p>
                </div>

                <div className="header-actions-group">
                    <div className="search-wrapper">
                        <Search size={16} className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Link to="/projects/create" className="btn-primary new-task-btn" style={{ textDecoration: 'none' }}>
                        <Plus size={18} />
                        <span>New Project</span>
                    </Link>
                </div>
            </div>

            <section className="projects-content-section">
                {!filteredProjects || filteredProjects.length === 0 ? (
                    <div className="empty-state-projects">
                        <div className="empty-icon">📁</div>
                        <h2>No projects yet</h2>
                        <p>No projects are currently available in the workspace.</p>
                    </div>
                ) : (
                    <ProjectList projects={filteredProjects} />
                )}
            </section>
        </div>
    );
};

export default ProjectsPage;