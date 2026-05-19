import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  tasksFromServerToUsers,
  mergeParticipantFromServer,
  mergeParticipant,
  removeTaskFromUsers,
  setTaskStatusOnUsers,
  normalizeTaskStatus,
} from "../dashboard/Workflow.js";

const USERS_STORAGE_KEY = "demo-workflow-users-v1";

function readUsersFromStorage() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeUsersToStorage(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    /* ignore quota / private mode */
  }
}

/* =========================
   CONTEXT
========================= */

const UsersContext = createContext(null);

/* =========================
   PROVIDER
========================= */

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [taskSearchQuery, setTaskSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const hydrationDoneRef = useRef(false);

  /* =========================
     LOAD LOCAL DATA
  ========================= */

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const cached = readUsersFromStorage();
      setUsers(cached?.length ? cached : []);
    } catch (err) {
      console.error("Failed to load users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
      hydrationDoneRef.current = true;
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!hydrationDoneRef.current) return;
    writeUsersToStorage(users);
  }, [users]);

  /* =========================
     ADD TASK
  ========================= */

  const addParticipant = useCallback(async (payload) => {
    const name = payload.userName?.trim();
    const title = payload.taskName?.trim();
    const project = payload.projectName?.trim();

    if (!name || !title || !project) return;

    const formattedPayload = {
      ...payload,
      status: normalizeTaskStatus(payload.status),
    };

    setUsers((prev) => mergeParticipant(prev, formattedPayload));

    setNotifications((prev) => [
      {
        id: Date.now(),
        message: `New task in "${project}": "${title}" assigned to ${name}`,
        type: "add",
        time: "now",
      },
      ...prev,
    ]);
  }, []);

  /* =========================
     DELETE TASK
  ========================= */

  const deleteTask = useCallback(async (taskRef) => {
    if (!taskRef) return;

    try {
      setUsers((prev) => removeTaskFromUsers(prev, taskRef));

      const label =
        taskRef.title && taskRef.project
          ? `Removed "${taskRef.title}" from ${taskRef.project}`
          : "Task deleted";

      setNotifications((prev) => [
        {
          id: Date.now(),
          message: label,
          type: "remove",
          time: "now",
        },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
    }
  }, []);

  /* =========================
     UPDATE STATUS
  ========================= */

  const setTaskStatus = useCallback(async (taskRef, newStatus) => {
    const status = normalizeTaskStatus(newStatus);

    try {
      setUsers((prev) =>
        setTaskStatusOnUsers(prev, taskRef, status)
      );

      const taskLabel = taskRef?.title || "Task";
      const proj = taskRef?.project ? ` (${taskRef.project})` : "";

      setNotifications((prev) => [
        {
          id: Date.now(),
          message: `Status: ${taskLabel}${proj} → ${status}`,
          type: "update",
          time: "now",
        },
        ...prev,
      ]);

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  /* =========================
     DERIVED DATA
  ========================= */

  const allTasks = useMemo(() => {
    return users.flatMap((u) =>
      (u.tasks || []).map((t) => ({
        ...t,
        userId: u.id,
        userName: u.name,
      }))
    );
  }, [users]);

  const filteredTasks = useMemo(() => {
    const q = taskSearchQuery.trim().toLowerCase();

    if (!q) return allTasks;

    return allTasks.filter((t) =>
      String(t.project).toLowerCase().includes(q)
    );
  }, [allTasks, taskSearchQuery]);

  /* =========================
     CONTEXT VALUE
  ========================= */

  const value = useMemo(
    () => ({
      users,
      loading,

      addParticipant,
      deleteTask,
      setTaskStatus,

      taskSearchQuery,
      setTaskSearchQuery,

      notifications,
      setNotifications,

      allTasks,
      filteredTasks,

      reload: loadData,
    }),
    [
      users,
      loading,
      addParticipant,
      deleteTask,
      setTaskStatus,
      taskSearchQuery,
      notifications,
      allTasks,
      filteredTasks,
      loadData,
    ]
  );

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useUsers() {
  const ctx = useContext(UsersContext);

  if (!ctx) {
    throw new Error("useUsers must be used within UsersProvider");
  }

  return ctx;
}