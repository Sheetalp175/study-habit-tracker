import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * usage: <SubTaskList taskId={task._id} token={token} />
 */
export default function SubTaskList({ taskId, token }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/subtasks/${taskId}`, headers);
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const add = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      await axios.post(`http://localhost:5000/api/subtasks/${taskId}`, { title }, headers);
      setTitle("");
      fetchItems();
    } catch (err) { console.error(err); }
  };

  const toggle = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/subtasks/${id}`, { isCompleted: !items.find(i => i._id === id).isCompleted }, headers);
      fetchItems();
    } catch (err) { console.error(err); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete subtask?")) return;
    await axios.delete(`http://localhost:5000/api/subtasks/${id}`, headers);
    fetchItems();
  };

  return (
    <div className="subtask-wrap">
      <form className="subtask-form" onSubmit={add}>
        <input className="input" placeholder="Add subtask..." value={title} onChange={(e) => setTitle(e.target.value)} />
        <button className="btn-primary small" type="submit">Add</button>
      </form>

      <ul className="subtask-list">
        {items.map((s) => (
          <li key={s._id} className={`subtask-item ${s.isCompleted ? "done" : ""}`}>
            <div>
              <input type="checkbox" checked={s.isCompleted} onChange={() => toggle(s._id)} />
              <span className="subtask-title">{s.title}</span>
            </div>
            <div>
              <button className="btn-ghost small" onClick={() => remove(s._id)}>Delete</button>
            </div>
          </li>
        ))}
        {items.length === 0 && <li className="muted">No subtasks</li>}
      </ul>
    </div>
  );
}
