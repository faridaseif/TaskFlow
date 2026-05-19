import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useProject from "../hooks/useProject";
import { useAuth } from "../context/AuthContext";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import "./ProjectDetailsPage.css";

const ProjectDetailsPage = () => {
    const { id } = useParams();
    const { project, addTask } = useProject(id);
    const { currentUser } = useAuth();

    const projectMembers = useMemo(() => {
        if (!project) return [];
        const list = [];
        const managerId = project.manager?.id;
        if (project.members) {
            project.members.forEach(m => {
                if (m.id !== managerId && !list.some(existing => existing.id === m.id)) {
                    list.push({ ...m, roleLabel: 'Member' });
                }
            });
        }
        return list;
    }, [project]);

    const isProjectManager = useMemo(() => {
        if (!project || !project.manager || !currentUser) return false;
        return String(project.manager.id) === String(currentUser.id) || 
               project.manager.email === currentUser.email;
    }, [project, currentUser]);

    const handleAddTask = async (task) => {
        await addTask(task);
    };

    if (!project) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading project details...</p>
            </div>
        );
    }

    return (
        <div className="details-page">
            <Link to="/projects" className="back-link">
                <ArrowLeft size={16} />
                <span>Back to Projects</span>
            </Link>

            <div className="project-detail-header">
                <h1 className="text-h1">{project.name}</h1>
                <p className="project-desc">{project.description}</p>
            </div>

            {isProjectManager && (
                <div className="project-action-section animate-fade-in">
                    <h3 className="section-title">Create New Task</h3>
                    <TaskForm onAdd={handleAddTask} members={projectMembers} />
                </div>
            )}

            <TaskList tasks={project.tasks || []} />
        </div>
    );
};

export default ProjectDetailsPage;