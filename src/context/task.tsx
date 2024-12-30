import { useEffect, useLayoutEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core"

interface Event {
    id: number;
    task_id: number;
    start_time: number;
    end_time: number;
}

export const useTask = (id: number, name: string, initEpalsed: number, updateList: Function) => {
    const [currentClock, setCurrentClock] = useState(initEpalsed);
    const [isRunning, setIsRunning] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [taskName, setTaskName] = useState(name ?? "");
    const [eventList, setEventList] = useState<Event[]>([]);
    const [showDelConfirm, setShowDelConfirm] = useState(false);
    const [showAddEvent, setShowAddEvent] = useState(false);
    const [eventDateTime, setEventDateTime] = useState("");
    const [eventSpendTime, setEventSpendTime] = useState(0);

    const addEvent = async () => {
        if (eventDateTime === "") return;
        const startTime = new Date(eventDateTime).getTime();
        const endTime = startTime + eventSpendTime * 60 * 60 * 1000;
        await invoke<boolean>("add_event_by_datetime", { taskId: id, startTime, endTime }).then(_ => {
            getTaskEventList();
            updateList();
            setShowAddEvent(false);
        });
    };

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
        getTaskEventList();
    };

    const resetTask = async () => {
        await pauseTask();
        setCurrentClock(0);
        await invoke("reset_task", { id });
    };

    const doneTask = async () => {
        await invoke("done_task", { id });
        updateList();
    };
    const processingTask = async () => {
        await invoke("processing_task", { id });
        updateList();
    };

    const getTaskEventList = async () => {
        setEventList(await invoke<Event[]>("get_task_event_list", { id }));
    };

    const deleteEventById = async (id: number) => {
        await invoke("delete_event", { id });
        getTaskEventList();
        updateList();
    };

    useLayoutEffect(() => {
        let didaFlag: boolean = true;
        const dida = () => {
            requestAnimationFrame(() => {
                if (!didaFlag) return;
                getTaskElapsed().then(elapsed => {
                    if (elapsed !== null) {
                        setCurrentClock(elapsed);
                        if (isRunning === false) setIsRunning(true);
                    } else {
                        pauseTask();
                        didaFlag = false;
                    }
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
        getTaskEventList();
    }, []);

    return {
        currentClock,
        isRunning,
        isEditable,
        taskName,
        eventList,
        showDelConfirm,
        showAddEvent,
        addEvent,
        setEventSpendTime,
        setEventDateTime,
        setShowAddEvent,
        setShowDelConfirm,
        deleteEventById,
        getTaskEventList,
        setTaskName,
        setIsEditable,
        resetTask,
        deleteTask,
        startTask,
        pauseTask,
        doneTask,
        processingTask,
        getTaskElapsed,
    };
};
