import { useMemo, useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, useDroppable } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers";

import Task from "./task";
import plusIcon from "@/assets/icons/plus.svg";
import processingIcon from "@/assets/icons/processing.svg";
import doneIcon from "@/assets/icons/done.svg";
import exportIcon from "@/assets/icons/export.svg";
import { useList } from "@/context/list";
import "./style.css";
import { useFS } from "@/context/fs";

export default function TaskList() {
    const { taskList, updateList, createTask, updateTask, handleTaskDragEnd } = useList();
    const { exportData } = useFS();
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showDone, setShowDone] = useState<boolean>(false);
    const [taskName, setTaskName] = useState("");
    const { isOver, setNodeRef } = useDroppable({ id: "droppable" });

    const style = {
        color: isOver ? "green" : undefined,
    };

    const TaskForm = useMemo(() => {
        if (showTaskForm) {
            return (
                <div className="form">
                    <div>
                        <label>任务名称</label>
                        <input className="text" spellCheck="false" onChange={v => setTaskName(v.target.value)} />
                    </div>
                    {/* <div>
                    <label>Project name</label>
                    <input type="text" name="task-project" className="text" />
                </div> */}
                    <div className="buttons">
                        <input
                            className="button"
                            type="button"
                            value="保存"
                            onClick={() => {
                                createTask(taskName);
                                setShowTaskForm(false);
                            }}
                        />
                        <input
                            className="button cancel"
                            type="button"
                            value="取消"
                            onClick={() => {
                                setShowTaskForm(false);
                            }}
                        />
                    </div>
                </div>
            );
        } else {
            return <></>;
        }
    }, [showTaskForm, taskName]);

    const showList = useMemo(() => {
        return taskList.filter(t => {
            if (showDone) return t.status === "Done";
            else return t.status === "Ready" || t.status === "Processing";
        });
    }, [taskList, showDone]);

    return (
        <div className="task-list">
            <div className="task-top-bar">
                <a className=" button" onClick={() => setShowTaskForm(v => !v)}>
                    <span>
                        <img src={plusIcon} />
                        添加
                    </span>
                </a>
                <a className={`button ${showDone === false ? "active-btn" : ""}`} onClick={() => setShowDone(false)}>
                    <span>
                        <img src={processingIcon} />
                        进行中
                    </span>
                </a>
                <a className={`button ${showDone === true ? "active-btn" : ""}`} onClick={() => setShowDone(true)}>
                    <span>
                        <img src={doneIcon} />
                        已完成
                    </span>
                </a>
                <a className="button" onClick={exportData}>
                    <span>
                        <img src={exportIcon} />
                        导出
                    </span>
                </a>
            </div>
            {TaskForm}
            <div className="content">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleTaskDragEnd}
                    modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
                >
                    <div className="form-list" ref={setNodeRef} style={style}>
                        <SortableContext items={showList} strategy={verticalListSortingStrategy}>
                            {showList.map(task => {
                                return (
                                    <Task
                                        key={task.id}
                                        updateList={updateList}
                                        updateTask={(name: string) => {
                                            updateTask(task.id, name).then(() => {
                                                updateList();
                                            });
                                        }}
                                        {...task}
                                    />
                                );
                            })}
                        </SortableContext>
                    </div>
                </DndContext>
            </div>
        </div>
    );
}
