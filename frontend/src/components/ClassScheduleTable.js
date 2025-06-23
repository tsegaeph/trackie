import React, { useState, useEffect } from "react";
import "./ClassScheduleTable.css";

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
function generateTimeRows() {
  const times = [];
  for (let h = 6; h < 18; h++) {
    times.push(`${(h % 12) === 0 ? 12 : h % 12}:00 ${h < 12 ? "AM" : "PM"}`);
    times.push(`${(h % 12) === 0 ? 12 : h % 12}:30 ${h < 12 ? "AM" : "PM"}`);
  }
  times.push("6:00 PM");
  return times;
}
const timeRows = generateTimeRows();
const defaultCell = { text: "", subject: "" };

// 8 visually distinct colors
const COLOR_PALETTE = [
  "#d67474",
  "#70b46d", 
  "#a36ab2",
  "#6aa5b2", 
  "#c8c76a", 
  "#947456",
  "#5d805a", 
  "#ab6f20", 
];

// Initial schedule: 25 rows x 7 columns
function getInitialSchedule() {
  const rows = timeRows.length;
  return Array.from({ length: rows }, () =>
    Array.from({ length: 7 }, () => ({ ...defaultCell }))
  );
}

// Extract subject name from cell text (first line only, trimmed, case-insensitive)
function extractSubject(text) {
  return (text || "")
    .split("\n")[0]
    .trim()
    .toLowerCase() || "";
}

export default function ClassScheduleTable() {
  const [schedule, setSchedule] = useState(getInitialSchedule());
  const [editCell, setEditCell] = useState(null); // { row, col }
  const [cellText, setCellText] = useState("");
  const [loading, setLoading] = useState(true);

  // Load schedule from backend on mount
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("https://trackie.onrender.com/api/classschedule", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (res.ok) {
          const cells = await res.json();
          const arr = getInitialSchedule();
          // Only fill in cells that are present (sparse array from backend)
          cells.forEach(({ row, col, text, subject }) => {
            arr[row][col] = { text, subject };
          });
          setSchedule(arr);
        }
      } catch (err) {
        console.error("Failed to fetch class schedule", err);
        alert("Failed to load class schedule.");
      }
      setLoading(false);
    };
    fetchSchedule();
  }, []);

  // Save schedule cells to backend
  const saveToBackend = async (cells) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("https://trackie.onrender.com/api/classschedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ cells }),
      });
      if (!res.ok) {
        throw new Error("Failed to save schedule");
      }
    } catch (err) {
      console.error("Failed to save class schedule", err);
      alert("Failed to save class schedule.");
    }
  };

  // Build subject→color mapping based on what's in the schedule
  function getSubjectColorMap() {
    const map = {};
    let colorIdx = 0;
    for (let r = 0; r < schedule.length; r++) {
      for (let c = 0; c < schedule[0].length; c++) {
        const subj = extractSubject(schedule[r][c].text);
        if (subj && !map[subj]) {
          map[subj] = COLOR_PALETTE[colorIdx % COLOR_PALETTE.length];
          colorIdx++;
        }
      }
    }
    return map;
  }
  const subjectColorMap = getSubjectColorMap();

  function handleCellClick(row, col) {
    setEditCell({ row, col });
    setCellText(schedule[row][col].text || "");
  }

  function saveScheduleToBackend(next) {
    // Convert current schedule (2D array) to a sparse array of non-empty cells for backend
    const cells = [];
    for (let r = 0; r < next.length; r++) {
      for (let c = 0; c < next[0].length; c++) {
        const cell = next[r][c];
        if (cell.text) {
          cells.push({ row: r, col: c, text: cell.text, subject: cell.subject });
        }
      }
    }
    saveToBackend(cells);
  }

  function handleSave() {
    const subject = extractSubject(cellText);
    setSchedule(prev => {
      const next = prev.map(arr => arr.slice());
      next[editCell.row][editCell.col] = {
        text: cellText,
        subject,
      };
      saveScheduleToBackend(next);
      return next;
    });
    setEditCell(null);
    setCellText("");
  }

  function handleDelete() {
    setSchedule(prev => {
      const next = prev.map(arr => arr.slice());
      next[editCell.row][editCell.col] = { ...defaultCell };
      saveScheduleToBackend(next);
      return next;
    });
    setEditCell(null);
    setCellText("");
  }

  function handleClose() {
    setEditCell(null);
    setCellText("");
  }

  if (loading) {
    return (
      <div className="class-schedule-dialog">
        <div className="class-schedule-header">
          <b>Class Schedule</b>
        </div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="class-schedule-dialog">
      <div className="class-schedule-header">
        <b>Class Schedule</b>
      </div>
      <table className="class-schedule-table">
        <thead>
          <tr>
            <th className="sched-time-th"></th>
            {days.map(day => (
              <th key={day} className="sched-day-th">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeRows.map((time, rIdx) => (
            <tr key={time}>
              <td className="sched-time-td">{time}</td>
              {days.map((_, cIdx) => {
                const cell = schedule[rIdx][cIdx];
                const subject = extractSubject(cell.text);
                const cellColor = subject ? subjectColorMap[subject] : "#fff";
                return (
                  <td
                    key={cIdx}
                    className="sched-cell"
                    style={{ background: cellColor, cursor: "pointer" }}
                    onClick={() => handleCellClick(rIdx, cIdx)}
                  >
                    {cell.text.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {editCell && (
        <div className="sched-edit-modal-backdrop" onClick={handleClose}>
          <div className="sched-edit-modal" onClick={e => e.stopPropagation()}>
            <h4>Edit Schedule Cell</h4>
            <textarea
              value={cellText}
              onChange={e => setCellText(e.target.value)}
              placeholder="e.g. MATH 101\nRm 215, MB"
              rows={3}
              className="sched-edit-textarea"
              autoFocus
            />
            <div className="sched-edit-actions">
              <button className="sched-save-btn" onClick={handleSave}>
                Save
              </button>
              <button className="sched-delete-btn" onClick={handleDelete}>
                Delete
              </button>
              <button className="sched-cancel-btn" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}