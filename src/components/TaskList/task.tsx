import "./style.css";
import { millisecondsToHHMMSS, unixtimeToHours } from "@/context/utils";
import { useTask } from "@/context/task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import removeIcon from "@/assets/icons/remove.svg";
import subIcon from "@/assets/icons/sub.svg";
import editIcon from "@/assets/icons/edit.svg";
import doneIcon from "@/assets/icons/done.svg";
import evtIcon from "@/assets/icons/addevt.svg";
import processingIcon from "@/assets/icons/processing.svg";
import confirmIcon from "@/assets/icons/confirm.svg";
import cancelIcon from "@/assets/icons/cancel.svg";
import { useRef, useState } from "react";

interface TaskProps {
    id: number;
    name: string;
    status: "Ready" | "Processing" | "Done";
    create_time: number;
    end_time: number | null;
    elapsed: number;
    updateList: () => void;
    updateTask: (name: string) => void;
}
export default function Task(props: TaskProps) {
    const { id, name, elapsed, status, updateList, updateTask } = props;
    const {
        currentClock,
        isRunning,
        eventList,
        showDelConfirm,
        isEditable,
        taskName,
        showAddEvent,
        setShowAddEvent,
        setEventSpendTime,
        setShowDelConfirm,
        deleteTask,
        startTask,
        pauseTask,
        doneTask,
        addEvent,
        setIsEditable,
        processingTask,
        setTaskName,
        deleteEventById,
        setEventDateTime,
    } = useTask(id, name, elapsed, updateList);

    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, active } = useSortable({ id: props.id });
    const [open, setOpen] = useState(false);
    const detailsRef = useRef<null | HTMLDetailsElement>(null);
    const style = { transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1, scaleX: 1 }), transition };

    return (
        <div className={`item ${isRunning ? "running" : ""}`.trim()} style={style} ref={setNodeRef} {...attributes}>
            <details ref={detailsRef} className="item-container" onToggle={e => (e.currentTarget.open = open)}>
                <summary
                    onPointerUp={_ => {
                        if (active?.rect.current) {
                            const { initial, translated } = active.rect.current;
                            if (detailsRef.current && initial && translated && initial.top === translated.top) {
                                detailsRef.current.open = !open;
                                setOpen(!open);
                            }
                        } else {
                            if (detailsRef.current) {
                                detailsRef.current.open = !open;
                                setOpen(!open);
                            }
                        }
                    }}
                >
                    {showDelConfirm && (
                        <div className="delete-confirm">
                            <span>你确定删除任务吗？</span>
                            <div className="delete-confirm-opt">
                                <img
                                    src={confirmIcon}
                                    onClick={e => {
                                        e.stopPropagation();
                                        deleteTask();
                                    }}
                                />
                                <img
                                    src={cancelIcon}
                                    onClick={e => {
                                        e.stopPropagation();
                                        setShowDelConfirm(false);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    <div className="item-task_title">
                        <div className="item-task" ref={setActivatorNodeRef} {...listeners}>
                            <div className="title">
                                {isEditable ? (
                                    <input defaultValue={name} autoFocus className={"name-input"} onChange={v => setTaskName(v.target.value)} />
                                ) : (
                                    name
                                )}
                            </div>
                        </div>
                        <div className="item-task-info">
                            <span className="timer">{millisecondsToHHMMSS(currentClock)}</span>
                            {status !== "Done" && (
                                <a
                                    className={`power ${isRunning ? "running" : "play"}`}
                                    onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        !isRunning ? startTask() : pauseTask();
                                    }}
                                ></a>
                            )}
                        </div>
                    </div>
                </summary>
                <div>
                    <div className="event-list-btn">
                        {!isEditable && (
                            <a
                                onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowAddEvent(v => !v);
                                }}
                            >
                                <img src={evtIcon} />
                                添加事件
                            </a>
                        )}
                        <a
                            onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (isEditable) {
                                    updateTask(taskName);
                                    setIsEditable(false);
                                } else {
                                    setIsEditable(true);
                                }
                            }}
                        >
                            {isEditable ? <img src={doneIcon} /> : <img src={editIcon} />} {isEditable ? "确认" : "编辑任务"}
                        </a>

                        {!isEditable && (
                            <a
                                className="done"
                                onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (status !== "Done") doneTask();
                                    else processingTask();
                                }}
                            >
                                <img src={status !== "Done" ? doneIcon : processingIcon} /> {status !== "Done" ? "完成任务" : "重新开始"}
                            </a>
                        )}
                        <a
                            className="remove"
                            onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                isEditable ? setIsEditable(false) : setShowDelConfirm(true);
                            }}
                        >
                            <img src={removeIcon} /> {isEditable ? "取消" : "删除任务"}
                        </a>
                    </div>
                    {showAddEvent && (
                        <div className="add-event-form">
                            <label>开始时间：</label>
                            <input
                                type="datetime-local"
                                className="add-event-form-datetime"
                                required
                                onChange={v => setEventDateTime(v.target.value)}
                            />
                            <pre>&nbsp;&nbsp;</pre>
                            <label>耗费时间：</label>
                            <input
                                className={"add-event-form-hours"}
                                type="number"
                                required
                                onChange={v => setEventSpendTime(Number(v.target.value))}
                            />
                            小时
                            <img className={"add-event-form-btn"} src={confirmIcon} onClick={addEvent} />
                            <img className={"add-event-form-btn"} src={cancelIcon} onClick={() => setShowAddEvent(false)} />
                        </div>
                    )}
                    {eventList.length > 0 && (
                        <ol className="event-list">
                            {eventList.map((evt, indx) => {
                                return (
                                    <li className="event" key={evt.id}>
                                        <div className="evt-no">{indx}</div>
                                        <div className="evt-date">
                                            <span className="evt-date-start">
                                                {`${new Date(evt.start_time).toLocaleDateString()} ${new Date(evt.start_time).toLocaleTimeString()}`}
                                            </span>
                                            <span> - </span>
                                            <span className="evt-date-end">
                                                {`${new Date(evt.end_time).toLocaleDateString()} ${new Date(evt.end_time).toLocaleTimeString()}`}
                                            </span>
                                        </div>
                                        <div className="evt-elapsed">{unixtimeToHours(evt.end_time - evt.start_time)}h</div>
                                        <div className="evt-opt">
                                            <img src={subIcon} onClick={() => deleteEventById(evt.id)} />
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    )}
                </div>
            </details>
        </div>
    );
}
