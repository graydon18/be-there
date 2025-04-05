import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Define days of the week
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Schedule state: an object with keys as day names and values as an array of 6 slots
  const [schedule, setSchedule] = useState({});

  // Fetch schedule from the backend on initial render
  const fetchSchedule = async () => {
    try {
      const response = await fetch('/schedule');
      const data = await response.json();
      setSchedule(data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // Handle when a user clicks on a slot to sign up
  const handleSlotClick = async (day, slot) => {
    const name = prompt("Enter your name:");
    if (!name) return;

    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
      <h1>Weekly Volunteer Schedule</h1>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th colSpan="6">Slots</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day}>
              <td>{day}</td>
              {Array.from({ length: 6 }).map((_, slot) => (
                <td
                  key={slot}
                  data-day={day}
                  data-slot={slot}
                  onClick={() => handleSlotClick(day, slot)}
                  style={{ cursor: 'pointer' }}
                >
                  {schedule[day] && schedule[day][slot] ? schedule[day][slot] : '[Empty]'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
