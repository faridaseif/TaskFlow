import { useEffect, useState } from "react";
import api from "../services/api";

const useProject = (id) => {
    const [project, setProject] = useState(null);

    useEffect(() => {
        if (id && id !== 'new' && id !== 'create') {
            fetchProject();
        }
    }, [id]);

    const fetchProject = async () => {
        try {
            const res = await api.get(`/api/projects/${id}`);

            // Teammate's backend returns the project directly as JSON
            setProject(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const addTask = async (task) => {
        try {
            await api.post(`/api/projects/${id}/tasks`, task);
            fetchProject();
        } catch (error) {
            console.error(error);
        }
    };

    return { project, fetchProject, addTask };
};

export default useProject;