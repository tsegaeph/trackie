import React, { useEffect, useState } from "react";
import "./DashboardHeaderCard.css";
import WeatherCard from "./WeatherCard";
import InfoChip from "./InfoChip";
import Modal from "./Modal";
import ClassScheduleTable from "./ClassScheduleTable";
import AssignmentDialog from "./AssignmentDialog";

// These should match your ClassScheduleTable.js!
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

function getNextClassCell(cells) {
  // cells: [{row, col, text, subject}]
  const now = new Date();
  let soonest = null;
  let soonestTime = null;

  cells.forEach(cell => {
    const dayIdx = cell.col; // 0 = SUN, ..., 6 = SAT
    const timeIdx = cell.row;
    // Compute the next date/time this class will occur
    const todayIdx = now.getDay();
    const daysUntil = (dayIdx - todayIdx + 7) % 7;
    // Parse time from timeRows[timeIdx]
    const timeLabel = timeRows[timeIdx];
    const [timePart, ampm] = timeLabel.split(" ");
    let [hour, minute] = timePart.split(":").map(Number);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    // Make a date for the next occurrence of this slot
    let occurrence = new Date(now);
    occurrence.setDate(now.getDate() + daysUntil);
    occurrence.setHours(hour, minute, 0, 0);

    // If it's today and already passed, move to next week
    if (occurrence <= now) {
      occurrence.setDate(occurrence.getDate() + 7);
    }
    if (!soonestTime || occurrence < soonestTime) {
      soonest = cell;
      soonestTime = occurrence;
    }
  });

  if (!soonest) return null;
  return {
    ...soonest,
    nextDate: soonestTime,
    dayLabel: days[soonest.col],
    timeLabel: timeRows[soonest.row]
  };
}

const DashboardHeaderCard = () => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [showAssignments, setShowAssignments] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [scheduleCells, setScheduleCells] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);

  // Fetch assignments (you already had this)
  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:5000/api/assignments", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch assignments");
      }

      const data = await res.json();
      const parsed = data.map(a => ({
        ...a,
        dueDate: new Date(a.dueDate),
      }));
      setAssignments(parsed.sort((a, b) => a.dueDate - b.dueDate));
    } catch (err) {
      console.error("Failed to fetch assignments", err);
      alert(err.message || "An error occurred while fetching assignments");
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Fetch schedule cells from backend
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("http://localhost:5000/api/classschedule", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const cells = await res.json();
          setScheduleCells(cells || []);
        }
      } catch (err) {
        console.error("Failed to fetch class schedule", err);
      }
      setScheduleLoading(false);
    };
    fetchSchedule();
  }, []);

  const addAssignment = async (assignment) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:5000/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(assignment),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add assignment");
      }

      const newAssignment = await res.json();
      newAssignment.dueDate = new Date(newAssignment.dueDate);
      setAssignments(prev =>
        [...prev, newAssignment].sort((a, b) => a.dueDate - b.dueDate)
      );
    } catch (err) {
      console.error("Failed to add assignment", err);
      alert(err.message || "An error occurred while adding assignment");
    }
  };

  const deleteAssignment = async (_id) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:5000/api/assignments/${_id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete assignment");
      }

      setAssignments(prev => prev.filter(a => a._id !== _id));
    } catch (err) {
      console.error("Failed to delete assignment", err);
      alert(err.message || "An error occurred while deleting assignment");
    }
  };

  const nearest = assignments.length
    ? assignments.reduce((a, b) => (a.dueDate < b.dueDate ? a : b))
    : null;

  // Only consider non-empty cells
  const filledCells = scheduleCells.filter(cell => cell.text && cell.text.trim());
  const nextClassCell = filledCells.length > 0 ? getNextClassCell(filledCells) : null;

  return (
    <div className="dashboard-header-card">
      <div className="dashboard-header-left">
        <h2>
           Good to see you, buddy! <span role="img" aria-label="waving hand">👋</span>
        </h2>
        <p className="dashboard-header-date">
          Here's your day's dashboard for{" "}
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="dashboard-header-chips-row">
          <InfoChip
            icon="📘"
            label="Next Class"
            mainText={
              scheduleLoading
                ? "Loading..."
                : !nextClassCell
                  ? "Set up your schedule for the semester!"
                  : `${nextClassCell.text.split("\n")[0]} - ${nextClassCell.dayLabel} ${nextClassCell.timeLabel}`
            }
            color="blue"
            onClick={() => setShowSchedule(true)}
          />
          <InfoChip
            icon="📝"
            label="Assignment"
            mainText={
              nearest
                ? `${nearest.title} - Due in ${Math.ceil(
                    (nearest.dueDate - new Date()) / (1000 * 60 * 60 * 24)
                  )} days`
                : "No assignments"
            }
            color="green"
            onClick={() => setShowAssignments(true)}
          />
        </div>
      </div>
      <div className="dashboard-header-right">
        <WeatherCard temperature="32" location="Abu Dhabi" />
      </div>

      {/* Dialogs */}
      <Modal open={showSchedule} onClose={() => setShowSchedule(false)}>
        <ClassScheduleTable />
      </Modal>
      <Modal open={showAssignments} onClose={() => setShowAssignments(false)}>
        <AssignmentDialog
          open={showAssignments}
          onClose={() => setShowAssignments(false)}
          assignments={assignments}
          addAssignment={addAssignment}
          deleteAssignment={deleteAssignment}
        />
      </Modal>
    </div>
  );
};

export default DashboardHeaderCard;