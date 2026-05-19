import { useEffect, useState } from "react";
import api from "../services/api";

const useProjects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get("/api/projects");
            setProjects(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteProject = async (id) => {
        try {
            await api.delete(`/api/projects/${id}`);
            fetchProjects();
        } catch (error) {
            console.error(error);
        }
    };

    const addProject = async (project) => {
        try {
            await api.post("/api/projects", project);
            fetchProjects();
        } catch (error) {
            console.error(error);
        }
    };

    const toggleFavorite = async (id) => {
        try {
            await api.patch(`/api/projects/${id}/favorite`);
            fetchProjects();
        } catch (error) {
            console.error(error);
        }
    };

    const joinProject = async (projectCode, userId) => {
        try {
            const res = await api.post("/api/projects/join", null, {
                params: {
                    code: projectCode,
                    userId: userId
                }
            });
            fetchProjects();
            return { success: true, project: res.data };
        } catch (error) {
            console.error(error);
            return { success: false, error: error?.response?.data?.message || "Failed to join project." };
        }
    };

    const verifyProjectCode = async (projectCode) => {
        try {
            const res = await api.get(`/api/projects/code/${projectCode}`);
            return { success: true, project: res.data };
        } catch (error) {
            console.error(error);
            return { success: false, error: error?.response?.data?.message || "Invalid invite code." };
        }
    };

    const addTaskToProject = async (projectId, task) => {
        try {
            await api.post(`/api/projects/${projectId}/tasks`, task);
            fetchProjects();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return { projects, fetchProjects, deleteProject, addProject, toggleFavorite, joinProject, verifyProjectCode, addTaskToProject };
};

// Support both named and default import styles
export { useProjects };
export default useProjects;