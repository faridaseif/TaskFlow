/** Pure helpers for workflow KPI computation — NO STORAGE */

export function normalizeTaskStatus(status) {
    const s = String(status || "").trim().toLowerCase();
  
    if (s === "pending" || s === "active" || s === "started") return "Pending";
    if (s === "in progress" || s === "inprogress") return "In Progress";
    if (s === "completed" || s === "done" || s === "complete") return "Completed";
  
    return "Pending";
  }
  
  /* =========================
     SERVER → UI TRANSFORM
  ========================= */
  
  export function tasksFromServerToUsers(tasks) {
    if (!Array.isArray(tasks)) return [];
  
    const map = new Map();
  
    for (const t of tasks) {
      const name = String(t.userName || "").trim();
      const project = String(t.project || "").trim();
      const title = String(t.title || "").trim();
  
      if (!name || !project || !title) continue;
  
      if (!map.has(name)) {
        map.set(name, {
          id: t.id || crypto?.randomUUID?.() || `${Date.now()}`,
          name,
          projects: [],
          tasks: [],
        });
      }
  
      const user = map.get(name);
  
      if (!user.projects.includes(project)) {
        user.projects.push(project);
      }
  
      user.tasks.push({
        id: t.id, // ✅ backend is source of truth
        title,
        project,
        status: normalizeTaskStatus(t.status),
      });
    }
  
    return Array.from(map.values());
  }
  
  /* =========================
     MERGE AFTER CREATE
  ========================= */
  
  export function mergeParticipantFromServer(users, task) {
    const name = String(task.userName || "").trim();
    const project = String(task.project || "").trim();
    const title = String(task.title || "").trim();
  
    if (!name || !project || !title) return users;
  
    const newTask = {
      id: task.id, // ✅ backend ID only
      title,
      project,
      status: normalizeTaskStatus(task.status),
    };
  
    const exists = users.find(
      (u) => u.name?.toLowerCase() === name.toLowerCase()
    );
  
    if (exists) {
      return users.map((u) => {
        if (u.name?.toLowerCase() !== name.toLowerCase()) return u;
  
        const projects = u.projects || [];
  
        return {
          ...u,
          projects: projects.includes(project)
            ? projects
            : [...projects, project],
          tasks: [...(u.tasks || []), newTask],
        };
      });
    }
  
    return [
      {
        id: task.id || `${Date.now()}`, // fallback only
        name,
        projects: [project],
        tasks: [newTask],
      },
      ...users,
    ];
  }

  /** Local-only merge when assign API fails (form payload shape from context). */
  export function mergeParticipant(users, payload) {
    const name = String(payload?.userName || "").trim();
    const project = String(payload?.projectName || "").trim();
    const title = String(payload?.taskName || "").trim();
    if (!name || !project || !title) return users;

    const task = {
      id: `local-${Date.now()}`,
      userName: name,
      title,
      project,
      status: normalizeTaskStatus(payload?.status),
    };
    return mergeParticipantFromServer(users, task);
  }
  
  /* =========================
     REMOVE TASK
  ========================= */
  
  export function removeTaskFromUsers(users, ref) {
    if (!ref) return users;
  
    const id = ref.id ? String(ref.id) : "";
  
    if (id) {
      return users.map((u) => ({
        ...u,
        tasks: (u.tasks || []).filter((t) => String(t.id) !== id),
      }));
    }
  
    const name = String(ref.userName || "").trim();
    const title = String(ref.title || "").trim();
    const project = String(ref.project || "").trim();
  
    return users.map((u) => {
      if (u.name?.trim() !== name) return u;
  
      return {
        ...u,
        tasks: (u.tasks || []).filter(
          (t) =>
            !(t.title === title && t.project === project)
        ),
      };
    });
  }
  
  /* =========================
     UPDATE STATUS
  ========================= */
  
  export function setTaskStatusOnUsers(users, ref, newStatus) {
    const status = normalizeTaskStatus(newStatus);
  
    const id = ref?.id ? String(ref.id) : "";
    const name = String(ref?.userName || "").trim();
    const title = String(ref?.title || "").trim();
    const project = String(ref?.project || "").trim();
  
    return users.map((u) => ({
      ...u,
      tasks: (u.tasks || []).map((t) => {
        const match =
          (id && String(t.id) === id) ||
          (!id &&
            u.name === name &&
            t.title === title &&
            t.project === project);
  
        if (!match) return t;
  
        return {
          ...t,
          status,
        };
      }),
    }));
  }
  
  /* =========================
     KPI STATS
  ========================= */
  
  export function computeKpiStats(tasks = []) {
    const total = tasks.length;
  
    const pending = tasks.filter(
      (t) => normalizeTaskStatus(t.status) === "Pending"
    ).length;
  
    const inProgress = tasks.filter(
      (t) => normalizeTaskStatus(t.status) === "In Progress"
    ).length;
  
    const completed = tasks.filter(
      (t) => normalizeTaskStatus(t.status) === "Completed"
    ).length;
  
    return {
      total,
      pending,
      inProgress,
      completed,
      percent: total ? Math.round((completed / total) * 100) : 0,
    };
  }