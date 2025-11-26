import React, { useEffect, useState } from "react";
import axios from "axios";
import WeeklyStats from "../components/WeeklyStats";
import StreakCounter from "../components/StreakCounter";
import SubTaskList from "../components/SubTaskList";
import "../App.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", estimateMin: 25, deadline: "" });
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Pomodoro
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const authHeaders = () => ({ headers: { Authorization: `Bearer ${token}` } });

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", authHeaders());
      setTasks(res.data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      // if 401, consider redirect to login
      if (err?.response?.status === 401) {
        alert("Please login again");
        window.location.href = "/login";
      }
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTaskId) {
        await axios.put(`http://localhost:5000/api/tasks/${editingTaskId}`, form, authHeaders());
        setEditingTaskId(null);
      } else {
        await axios.post("http://localhost:5000/api/tasks", form, authHeaders());
      }
      setForm({ title: "", estimateMin: 25, deadline: "" });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task._id);
    setForm({ title: task.title, estimateMin: task.estimateMin, deadline: task.deadline.split("T")[0] });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, authHeaders());
    fetchTasks();
  };

  // Pomodoro interval
  useEffect(() => {
    let timer = null;
    if (isActive && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    } else if (isActive && secondsLeft === 0) {
      setIsActive(false);
      alert(`Completed: ${currentTask?.title || "Task"}`);
    }
    return () => clearInterval(timer);
  }, [isActive, secondsLeft, currentTask]);

  const toggleTimer = (task) => {
    const deadline = new Date(task.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // if deadline before today -> block
    if (deadline < today) {
      alert("Deadline passed. Cannot start task.");
      return;
    }
    // start new or toggle same
    if (!currentTask || currentTask._id !== task._id) {
      setCurrentTask(task);
      setSecondsLeft((task.estimateMin || 25) * 60);
      setIsActive(true);
    } else {
      setIsActive((p) => !p);
    }
  };

  const resetTimer = () => {
    if (currentTask) setSecondsLeft((currentTask.estimateMin || 25) * 60);
    setIsActive(false);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="page-wrap">
      <div className="header">
        <h1>Study Tracker</h1>
        <div className="header-actions">
          <StreakCounter />
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 className="card-title">Add / Edit Task</h3>
          <form className="form-inline" onSubmit={handleSubmit}>
            <input className="input" name="title" value={form.title} onChange={handleChange} placeholder="Task title" required />
            <input className="input small" name="estimateMin" type="number" value={form.estimateMin} onChange={handleChange} placeholder="Min" required />
            <input className="input" name="deadline" type="date" value={form.deadline} onChange={handleChange} required />
            <button className="btn-primary">{editingTaskId ? "Update" : "Add Task"}</button>
          </form>
        </div>

        <div className="card">
          <h3 className="card-title">Weekly Overview</h3>
          <WeeklyStats />
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Tasks</h3>
        <table className="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Est. (min)</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 && (
              <tr><td colSpan="4" className="muted">No tasks yet — create one above</td></tr>
            )}
            {tasks.map((task) => {
              const deadline = new Date(task.deadline);
              const today = new Date(); today.setHours(0,0,0,0);
              const disableStart = deadline < today;
              return (
                <React.Fragment key={task._id}>
                  <tr>
                    <td>{task.title}</td>
                    <td>{task.estimateMin}</td>
                    <td>{deadline.toLocaleDateString()}</td>
                    <td>
                      <button className="btn-ghost" onClick={() => handleEdit(task)}>Edit</button>
                      <button className="btn-ghost" onClick={() => handleDelete(task._id)}>Delete</button>
                      <button
                        className="btn-primary small"
                        style={{ opacity: disableStart ? 0.5 : 1 }}
                        onClick={() => toggleTimer(task)}
                        disabled={disableStart}
                      >
                        {isActive && currentTask?._id === task._id ? "Pause" : "Start"}
                      </button>
                    </td>
                  </tr>

                  <tr className="subtask-row">
                    <td colSpan="4">
                      <SubTaskList taskId={task._id} token={token} />
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pomodoro panel */}
      {currentTask && (
        <div className="card timer-card">
          <div className="timer-left">
            <div className="muted">Focus on</div>
            <h2>{currentTask.title}</h2>
          </div>
          <div className="timer-right">
            <div className="timer-big">{formatTime(secondsLeft)}</div>
            <div className="timer-controls">
              <button className="btn-ghost" onClick={() => setIsActive(!isActive)}>{isActive ? "Pause" : "Resume"}</button>
              <button className="btn-ghost" onClick={resetTimer}>Reset</button>
              <button className="btn-danger" onClick={() => { setIsActive(false); setSecondsLeft(0); alert("Cancelled"); }}>Cancel</button>
              <button className="btn-primary" onClick={() => { setIsActive(false); setSecondsLeft(0); alert("Completed!"); }}>Complete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
