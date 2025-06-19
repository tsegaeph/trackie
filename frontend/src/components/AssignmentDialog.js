import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AssignmentDialog.css";

function AssignmentDialog({ open, onClose, assignments, addAssignment, deleteAssignment }) {
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState("");

  const handleAdd = async () => {
    if (title && date) {
      try {
        await addAssignment({
          title,
          dueDate: date.toISOString(),
        });
        setTitle("");
        setDate(new Date());
      } catch (error) {
        alert("Error adding assignment: " + error.message);
      }
    }
  };

  return (
    <div className="assignment-dialog">
      <h3>Assignments</h3>
      <div className="assignment-input-row">
        <input
          className="assignment-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Assignment Title"
        />
        <DatePicker
          selected={date}
          onChange={setDate}
          dateFormat="yyyy-MM-dd"
          minDate={new Date()}
          className="assignment-datepicker"
        />
        <button className="assignment-add-btn" onClick={handleAdd}>
          Add
        </button>
      </div>
      <ul className="assignment-list">
        {assignments.map((a) => (
          <li key={a._id} className="assignment-list-item">
            <b>{a.title}</b> – due {new Date(a.dueDate).toLocaleDateString()}
            <button className="assignment-delete-btn" onClick={() => deleteAssignment(a._id)}>
              Delete
            </button>
          </li>
        ))}
        {assignments.length === 0 && <li>No assignments yet.</li>}
      </ul>
    </div>
  );
}

export default AssignmentDialog;