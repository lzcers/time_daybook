import "./style.css";
import { millisecondsToHHMMSS } from "@/context/utils";
import { useTask } from "@/context/task";

interface TaskProps {
    id: number;
    name: string;
    status: "Ready" | "Processing" | "Done";
    create_time: number;
    end_time: number | null;
    elapsed: number;
    updateList: () => void;
}
export default function Task(props: TaskProps) {
    const { id, name, elapsed, updateList } = props;
    const { currentClock, isRunning, deleteTask, startTask, pauseTask, resetTask } = useTask(id, elapsed, updateList);
    return (
        <div className={`item ${isRunning ? "running" : ""}`.trim()}>
            <div className="item-container">
                <label className="title">
                    {name}
                    <br />
                    <small></small>
                </label>
                <div className="item-btn">
                    <a className="update">Edit |</a>
                    <a className="reset" onClick={resetTask}>
                        Reset |
                    </a>
                    <a className="remove" onClick={deleteTask}>
                        Delete
                    </a>
                </div>
                <span className="timer">{millisecondsToHHMMSS(currentClock)}</span>
                <a className={`power ${isRunning ? "running" : "play"}`} onClick={!isRunning ? startTask : pauseTask}></a>
            </div>
        </div>
    );
}
