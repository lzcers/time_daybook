import { invoke } from "@tauri-apps/api";
import { useEffect, useLayoutEffect, useState } from "react";

interface Task {
    id: number;
    name: string;
    status: "Ready" | "Processing" | "Done";
    create_time: number;
    end_time: number | null;
}
export const useTauri = () => {
    const [currentClock, setCurrentClock] = useState({ taskId: -1, elapsed: 0 });
    const [taskList, setTaskList] = useState<Task[]>([]);

    const getTaskList = async () => {
        setTaskList(await invoke<Task[]>("get_task_list"));
    };

    const createTask = async (name: string, projectId?: number) => {
        await invoke("new_task", { name, projectId });
        await getTaskList();
    };

    const deleteTask = async (id: number) => {
        await invoke("delete_task", { id });
        await getTaskList();
    };

    const getTaskElapsed = async (id: number) => {
        return await invoke<number>("get_task_elapsed", { id });
    };

    const startTask = async (id: number) => {
        await invoke("start_task", { id });
        setCurrentClock({ taskId: id, elapsed: 0 });
    };

    const pauseTask = async (id: number) => {
        await invoke("pause_task", { id });
        setCurrentClock({ taskId: -1, elapsed: 0 });
    };

    useLayoutEffect(() => {
        if (currentClock.taskId !== -1) {
            getTaskElapsed(currentClock.taskId).then(elapsed => {
                setCurrentClock({ taskId: currentClock.taskId, elapsed });
            });
        }
    }, [currentClock]);

    useEffect(() => {
        getTaskList();
    }, []);

    return {
        taskList,
        currentClock,
        getTaskList,
        createTask,
        deleteTask,
        startTask,
        pauseTask,
        getTaskElapsed,
    };
};
