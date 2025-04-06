// App.jsx
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

  const [user, setUser] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [loginForm, setLoginForm] = useState({ name: '', username: '' });
  const [loginError, setLoginError] = useState('');

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
    if (slot === 0 || (slot >= 1 && slot <= 3)) return true;
    if (slot === 4) return schedule[day] && schedule[day][0] !== "";
    if (slot === 5) return schedule[day] && schedule[day][1] && schedule[day][2] && schedule[day][3];
    return false;
  };

  const handleSlotClick = async (day, slot) => {
    if (!user) return alert("Please log in first.");
    if (!isSlotAllowed(day, slot)) return alert("Please fill the main positions before signing up for backup.");
    if (schedule[day] && schedule[day][slot] !== "") return alert("This slot is already taken.");

    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, slot, name: user.name })
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (data.success) {
        setUser({ name: data.name, username: data.username });
      } else {
        setLoginError(data.error);
      }
    } catch (err) {
      setLoginError("Failed to connect to server.");
    }
  };

  if (!user) {
    return (
      <div className="login-container">
        <h1>Be There Login</h1>
        <form onSubmit={handleLoginSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={loginForm.name}
            onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Username (must be unique)"
            value={loginForm.username}
            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
            required
          />
          <button type="submit">Login</button>
        </form>
        {loginError && <p className="error">{loginError}</p>}
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Be There - Welcome {user.name}!</h1>
      <table>
        <thead>
          <tr>
            <th rowSpan="2">Day</th>
            <th rowSpan="2">Driver</th>
            <th colSpan="3">Packer</th>
            <th rowSpan="2">Backup Driver</th>
            <th rowSpan="2">Backup Packer</th>
          </tr>
        </thead>
        <tbody>
          {days.map(day => (
            <tr key={day}>
              <td>{day}</td>
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
