import { useState } from "react";
import Task from "./task";
import plusIcon from "@/icons/plus.svg";
import removeIcon from "@/icons/remove.svg";

import { useList } from "@/context/list";
import "./style.css";
import { convertMillisecondsToDaysHours } from "@/context/utils";

export default function TaskList() {
    const { taskList, updateList, createTask, resetAllTask, deleteAllTask } = useList();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
    const [showResetAllDialog, setShowResetAllDialog] = useState(false);

    const CreateForm = () => {
        const [taskName, setTaskName] = useState("");
        return (
            <div className="form">
                <div>
                    <label>Task name</label>
                    <input type="text" onChange={v => setTaskName(v.target.value)} className="text" required />
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
                            createTask(taskName);
                            setShowCreateForm(false);
                        }}
                    />
                    <input
                        type="button"
                        className="cancel"
                        value="Cancel"
                        onClick={() => {
                            setShowCreateForm(false);
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
                <a className="create button" onClick={() => setShowCreateForm(v => !v)}>
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
                <div className="form-list">
                    {taskList.map(task => {
                        return <Task key={task.id} updateList={updateList} {...task} />;
                    })}
                </div>
                {showCreateForm && <CreateForm />}
                {showDeleteAllDialog && <DeleteAllDialog />}
                {showResetAllDialog && <ResetAllDialog />}
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
