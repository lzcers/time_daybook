import { invoke } from "@tauri-apps/api";
import { getAll } from "@tauri-apps/api/window";
import { useEffect, useLayoutEffect, useState } from "react";

interface Task {
    id: number;
    name: string;
    status: "Ready" | "Processing" | "Done";
    create_time: number;
    end_time: number | null;
    elapsed: number;
}

export const useList = () => {
    const [taskList, setTaskList] = useState<Task[]>([]);

    const updateList = async () => {
        const list = await invoke<Task[]>("get_task_list");
        setTaskList(list);
    };

    const createTask = async (name: string, projectId?: number) => {
        await invoke("new_task", { name, projectId });
        await updateList();
    };

    const resetAllTask = async () => {
        await invoke("reset_all_task");
        await updateList();
    };

    const deleteAllTask = async () => {
        await invoke("delete_all_task");
        await updateList();
    };

    useEffect(() => {
        updateList();
    }, []);

    return {
        taskList,
        createTask,
        updateList,
        resetAllTask,
        deleteAllTask,
    };
};
