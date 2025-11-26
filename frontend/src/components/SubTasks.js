import React, { useEffect, useState } from "react";
import axios from "axios";

const SubTasks = ({ taskId }) => {
  const [subtasks, setSubtasks] = useState([]);
  const [title, setTitle] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSubTasks();
  }, []);

  const fetchSubTasks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/subtasks/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubtasks(res.data);
    } catch (err) {}
  };

  const addSubTask = async () => {
    if (!title.trim()) return alert("Enter sub-task name");

    await axios.post(
      `http://localhost:5000/api/subtasks/${taskId}`,
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTitle("");
    fetchSubTasks();
  };

  const toggleStatus = async (id) => {
    await axios.put(
      `http://localhost:5000/api/subtasks/toggle/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchSubTasks();
  };

  const deleteSubTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/subtasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchSubTasks();
  };

  return (
    <div style={{ marginTop: "10px", paddingLeft: "20px" }}>
      <h4>📝 Sub-Tasks</h4>

      <div>
        <input
          type="text"
          placeholder="Add sub-task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "5px" }}
        />
        <button onClick={addSubTask} style={{ marginLeft: "5px" }}>
          ➕ Add
        </button>
      </div>

      {subtasks.map((s) => (
        <div key={s._id} style={{ marginTop: "5px" }}>
          <input
            type="checkbox"
            checked={s.isCompleted}
            onChange={() => toggleStatus(s._id)}
          />
          <span
            style={{
              textDecoration: s.isCompleted ? "line-through" : "none",
              marginLeft: "8px",
            }}
          >
            {s.title}
          </span>

          <button
            onClick={() => deleteSubTask(s._id)}
            style={{ marginLeft: "10px", color: "red" }}
          >
            ❌
          </button>
        </div>
      ))}
    </div>
  );
};

export default SubTasks;
