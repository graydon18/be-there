import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const roleLabels = {
    0: "Driver",
    1: "Packer",
    2: "Packer",
    3: "Packer",
    4: "Backup Driver",
    5: "Backup Packer"
  };

  const [schedule, setSchedule] = useState({});

  const fetchSchedule = async () => {
    try {
      const response = await fetch('http://localhost:3001/schedule');
      const data = await response.json();
      setSchedule(data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const isSlotAllowed = (day, slot) => {
    if (slot === 0 || (slot >= 1 && slot <= 3)) {
      return true;
    }
    if (slot === 4) {
      return schedule[day] && schedule[day][0] !== "";
    }
    if (slot === 5) {
      return schedule[day] && schedule[day][1] !== "" && schedule[day][2] !== "" && schedule[day][3] !== "";
    }
    return false;
  };

  const handleSlotClick = async (day, slot) => {
    if (!isSlotAllowed(day, slot)) {
      alert("Please fill the main positions before signing up for backup.");
      return;
    }
    if (schedule[day] && schedule[day][slot] !== "") {
      alert("This slot is already taken.");
      return;
    }
    const role = roleLabels[slot];
    const name = prompt(`Enter your name to sign up as ${role}:`);
    if (!name) return;

    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, slot, name })
      });
      const data = await response.json();
      if (data.success) {
        setSchedule(data.schedule);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="App">
      <h1>Be There</h1>
      <table>
        <thead>
          <tr>
            <th rowSpan="2">Day</th>
            <th rowSpan="2">Driver</th>
            <th colSpan="3">Packer</th>
            <th rowSpan="2">Backup Driver</th>
            <th rowSpan="2">Backup Packer</th>
          </tr>
          <tr>
          </tr>
        </thead>
        <tbody>
          {days.map(day => (
            <tr key={day}>
              <td>{day}</td>
              {/** Render cells in the order:
                  0: Driver, 1-3: Packer, 4: Backup Driver, 5: Backup Packer */}
              {[0, 1, 2, 3, 4, 5].map(slot => {
                const allowed = isSlotAllowed(day, slot);
                const cellStyle = {
                  cursor: 'pointer',
                  backgroundColor: allowed ? '#fff' : '#ddd'
                };
                return (
                  <td key={slot} onClick={() => handleSlotClick(day, slot)} style={cellStyle}>
                    {schedule[day] && schedule[day][slot] ? schedule[day][slot] : '[Empty]'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
