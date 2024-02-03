import { useState } from "react";
import { useTauri } from "@/context/tauri";
import "./style.css";

export function TaskList() {
  const {
    taskList,
    currentClock,
    createTask,
    deleteTask,
    startTask,
    pauseTask,
  } = useTauri();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [showResetAllDialog, setShowResetAllDialog] = useState(false);

  const CreateForm = () => {
    const [taskName, setTaskName] = useState("");
    return (
      <div className="form">
        <div>
          <label>Task name</label>
          <input
            type="text"
            onChange={(v) => setTaskName(v.target.value)}
            className="text"
            required
          />
        </div>
        <div>
          <label>Project name</label>
          <input type="text" name="task-project" className="text" />
        </div>
        <div className="buttons">
          <input
            type="button"
            value="Save"
            onClick={() => {
              createTask(taskName);
              setShowCreateForm(false);
            }}
          />
          <input type="button" className="cancel" value="Cancel" />
        </div>
      </div>
    );
  };
  const DeleteAllDialog = () => {
    return (
      <div className="form">
        <p className="remove-confirm">
          Are you sure you want to delete all tasks?
        </p>
        <p className="buttons">
          <input type="button" className="button-remove" value="Delete" />
          <input type="button" className="cancel" value="Cancel" />
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
          <input type="button" value="Yes" />
          <input type="button" className="cancel" value="Cancel" />
        </p>
      </div>
    );
  };
  return (
    <div className="task-list">
      <div className="task-top-bar">
        <a
          className="create button"
          onClick={() => {
            setShowCreateForm((v) => !v);
          }}
        >
          <span>New</span>
        </a>
        <a
          className="reset-all button"
          onClick={() => setShowResetAllDialog((v) => !v)}
        >
          <span>Reset All</span>
        </a>
        <a
          className="remove-all button"
          onClick={() => setShowDeleteAllDialog((v) => !v)}
        >
          <span></span>Delete All
        </a>
        <a className="export-all button">
          <span>Export All</span>
        </a>
      </div>
      <div className="content">
        <div className="form-list">
          {taskList.map((task) => {
            return (
              <div className="item" key={task.id}>
                <div className="item-container">
                  <label className="title">
                    {task.name}
                    <br />
                    <small></small>
                  </label>
                  <div className="item-btn">
                    <a className="update">Edit |</a>
                    <a className="reset">Reset |</a>
                    <a className="remove" onClick={() => deleteTask(task.id)}>
                      Delete
                    </a>
                  </div>
                  <span className="timer">
                    {currentClock.taskId === task.id
                      ? currentClock.elapsed
                      : "0:00:00"}
                  </span>
                  <a
                    className={`power ${currentClock.taskId === task.id ? "running" : "play"}`}
                    onClick={() => {
                      currentClock.taskId !== task.id
                        ? startTask(task.id)
                        : pauseTask(task.id);
                    }}
                  ></a>
                </div>
              </div>
            );
          })}
        </div>
        {showCreateForm && <CreateForm />}
        {showDeleteAllDialog && <DeleteAllDialog />}
        {showResetAllDialog && <ResetAllDialog />}
      </div>
      <div className="footer">
        <span className="version">Time Tracker V0.1</span>
        <span className="total-time">
          Total: <span className="total-time-counter"></span>
        </span>
      </div>
    </div>
  );
}
