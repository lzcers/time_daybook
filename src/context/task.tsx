import { invoke } from "@tauri-apps/api";
import { useEffect, useLayoutEffect, useState } from "react";

export const useTask = (id: number, initEpalsed: number, updateList: Function) => {
    const [currentClock, setCurrentClock] = useState(initEpalsed);
    const [isRunning, setIsRunning] = useState(false);

    const deleteTask = async () => {
        await invoke("delete_task", { id });
        updateList();
    };

    const getTaskElapsed = async () => {
        return await invoke<number>("get_task_elapsed", { id });
    };

    const startTask = async () => {
        await invoke("start_task", { id });
        setIsRunning(true);
    };

    const pauseTask = async () => {
        await invoke("pause_task", { id });
        setIsRunning(false);
        updateList();
    };

    const resetTask = async () => {
        await pauseTask();
        setCurrentClock(0);
        await invoke("reset_task", { id });
    };

    useLayoutEffect(() => {
        if (!isRunning) return;
        let didaFlag: boolean = isRunning;
        const dida = () => {
            requestAnimationFrame(() => {
                if (!didaFlag) return;
                getTaskElapsed().then(elapsed => {
                    if (elapsed !== null) setCurrentClock(elapsed);
                    else pauseTask();
                    dida();
                });
            });
        };
        dida();
        return () => {
            didaFlag = false;
        };
    }, [isRunning]);

    useLayoutEffect(() => {
        setCurrentClock(initEpalsed);
    }, [initEpalsed]);

    useEffect(() => {
        return () => {
            pauseTask();
        };
    }, []);

    return {
        currentClock,
        isRunning,
        resetTask,
        deleteTask,
        startTask,
        pauseTask,
        getTaskElapsed,
    };
};
