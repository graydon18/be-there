// App.jsx
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

  const handleSlotClick = async (day, slot) => {
    if (!user) return alert("Please log in first.");
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

  const isDriverScheduled = (day) => {
    return schedule[day] && schedule[day][0] !== ""; 
   };

   const arePackersScheduled = (day) => {
    return schedule[day] && schedule[day][1] && schedule[day][2] && schedule[day][3];
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

      <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Driver</th>
            <th colSpan="3">Packers</th>
          </tr>
        </thead>
        <tbody>
          {days.map(day => (
            <tr key={day}>
              <td>{day}</td>
              {Array.from({ length: 4 }).map((_, slot) => (
                 <td
                   key={slot}
                   data-day={day}
                   data-slot={slot}
                   onClick={() => handleSlotClick(day, slot)}
                   style={{ cursor: 'pointer' }}
                 >
                    {schedule[day] && schedule[day][slot] ? schedule[day][slot] : '[Available]'}
                  </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="button-columns">
          <div className="backup-driver">
            {days.map((day, index) => (
              <button 
                key={`driver-${day}`}
                disabled={!isDriverScheduled(day)}  
                onClick={() => alert(`Sign up as Backup Driver for ${day}`)}
                >
                Sign Up as a Backup Driver
              </button>
            ))}
          </div>
          <div className="backup-packer">
            {days.map((day, index) => (
              <button 
                key={`packer-${day}`}
                disabled={!arePackersScheduled(day)}  
                onClick={() => alert(`Sign up as Backup Packer for ${day}`)}
                >
                Sign Up as a Backup Packer
              </button>
            ))}
          </div>
        </div>
       </div>
    </div>
  );
}

export default App;
