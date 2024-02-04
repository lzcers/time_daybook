import { useState } from "react";
import Task from "./task";
import plusIcon from "@/icons/plus.svg";
import removeIcon from "@/icons/remove.svg";

import { useList } from "@/context/list";
import "./style.css";
import { convertMillisecondsToDaysHours } from "@/context/utils";

export default function TaskList() {
    const { taskList, updateList, createTask, updateTask, resetAllTask, deleteAllTask } = useList();
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
    const [showResetAllDialog, setShowResetAllDialog] = useState(false);
    const [isEdit, setIsEdit] = useState<{ id: number; name: string } | null>(null);
    const TaskForm = (p: { isEdit: { id: number; name: string } | null }) => {
        const { isEdit } = p;
        const [taskName, setTaskName] = useState(isEdit?.name ?? "");
        return (
            <div className="form">
                <div>
                    <label>Task name</label>
                    <input type="text" onChange={v => setTaskName(v.target.value)} defaultValue={isEdit?.name} className="text" required />
                </div>
                {/* <div>
                    <label>Project name</label>
                    <input type="text" name="task-project" className="text" />
                </div> */}
                <div className="buttons">
                    <input
                        type="button"
                        value="Save"
                        onClick={() => {
                            if (isEdit) {
                                updateTask(isEdit.id, taskName).then(() => {
                                    setIsEdit(null);
                                    setShowTaskForm(false);
                                    updateList();
                                });
                            } else {
                                createTask(taskName);
                                setShowTaskForm(false);
                            }
                        }}
                    />
                    <input
                        type="button"
                        className="cancel"
                        value="Cancel"
                        onClick={() => {
                            setShowTaskForm(false);
                        }}
                    />
                </div>
            </div>
        );
    };
    const DeleteAllDialog = () => {
        return (
            <div className="form">
                <p className="remove-confirm">Are you sure you want to delete all tasks?</p>
                <p className="buttons">
                    <input
                        type="button"
                        className="button-remove"
                        value="Delete"
                        onClick={() => {
                            deleteAllTask();
                            setShowDeleteAllDialog(false);
                        }}
                    />
                    <input type="button" className="cancel" value="Cancel" onClick={() => setShowDeleteAllDialog(false)} />
                </p>
            </div>
        );
    };
    const ResetAllDialog = () => {
        return (
            <div className="htmlForm">
                <p className="remove-confirm">
                    Are you sure you want to <strong>reset all tasks</strong>?
                </p>
                <p className="buttons">
                    <input
                        type="button"
                        value="Yes"
                        onClick={() => {
                            resetAllTask();
                            setShowResetAllDialog(false);
                        }}
                    />
                    <input type="button" className="cancel" value="Cancel" onClick={() => setShowResetAllDialog(false)} />
                </p>
            </div>
        );
    };

    return (
        <div className="task-list">
            <div className="task-top-bar">
                <a className="create button" onClick={() => setShowTaskForm(v => !v)}>
                    <span>
                        <img src={plusIcon} />
                        New
                    </span>
                </a>
                <a className="reset-all button" onClick={() => setShowResetAllDialog(v => !v)}>
                    <span>Reset All</span>
                </a>
                <a className="remove-all button" onClick={() => setShowDeleteAllDialog(v => !v)}>
                    <span>
                        <img src={removeIcon} />
                        Delete All
                    </span>
                </a>
                <a className="export-all button">
                    <span>Export All</span>
                </a>
            </div>
            <div className="content">
                {showTaskForm && <TaskForm isEdit={isEdit} />}
                {showDeleteAllDialog && <DeleteAllDialog />}
                {showResetAllDialog && <ResetAllDialog />}
                <div className="form-list">
                    {taskList.map(task => {
                        return (
                            <Task
                                key={task.id}
                                updateList={updateList}
                                updateTask={() => {
                                    setIsEdit({ id: task.id, name: task.name });
                                    setShowTaskForm(true);
                                }}
                                {...task}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="footer">
                <span className="version">Time Tracker V0.1</span>
                <span className="total-time">
                    Total:
                    <span className="total-time-counter">
                        {convertMillisecondsToDaysHours(taskList.reduce((prev, cur) => prev + cur.elapsed, 0))}
                    </span>
                </span>
            </div>
        </div>
    );
}
