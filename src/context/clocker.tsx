import { useLayoutEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core"

export const useClocker = () => {
    const [allElapsed, setAllElapsed] = useState(0);
    const [todayElapsed, setTodayEplased] = useState(0);

    const [show, setShow] = useState<"all" | "today">("all");

    const getAllElapsed = async () => await invoke<number>("get_all_elapsed");

    const getTodayElapsed = async () => await invoke<number>("get_today_elapsed");

    useLayoutEffect(() => {
        let flag = true;
        const dida = () => {
            requestAnimationFrame(async () => {
                if (!flag) return;
                setAllElapsed(await getAllElapsed());
                setTodayEplased(await getTodayElapsed());
                dida();
            });
        };
        dida();
        return () => {
            flag = false;
        };
    }, []);

    return {
        show,
        allElapsed,
        todayElapsed,
        setShow,
    };
};
