import { useEffect, useState } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { invoke } from "@tauri-apps/api";

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

    const updateTask = async (id: number, name: string) => {
        await invoke("update_task", { id, name });
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

    const handleTaskDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setTaskList(items => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                invoke("swap_task_by_index", { oldIndex, newIndex });
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    useEffect(() => {
        updateList();
    }, []);

    return {
        taskList,
        updateTask,
        createTask,
        updateList,
        resetAllTask,
        deleteAllTask,
        handleTaskDragEnd,
    };
};
