// App.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [user, setUser] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [loginForm, setLoginForm] = useState({ name: '', username: '' });
  const [loginError, setLoginError] = useState('');
  const [isSignup, setIsSignup] = useState(false);

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
    const storedUser = localStorage.getItem("be-there-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSlotClick = async (day, slot) => {
    if (!user) return alert("Please log in first.");

    const clickedSlot = schedule[day]?.slots?.[slot];

    if (clickedSlot !== null) {
      if (clickedSlot.username === user.username) {
        const confirmDelete = window.confirm("Do you want to delete yourself from this slot?");
        if (confirmDelete) {
          try {
            const response = await fetch('http://localhost:3001/slot', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ day, slot, username: user.username })
            });
            const data = await response.json();
            if (data.success) {
              setSchedule(data.schedule);
            } else {
              alert(data.error);
            }
          } catch (error) {
            console.error('Error deleting slot:', error);
          }
        }
      } else {
        return alert("This slot is already taken.");
      }
      return;
    }

    if (schedule[day]?.slots?.some(s => s?.username === user.username)) {
      return alert("You're already scheduled for this day.");
    }

    const confirmRegister = window.confirm(`Do you want to register yourself on ${day}`);
        if (confirmRegister) {
            try {
                const response = await fetch('http://localhost:3001/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ day, slot, name: user.name, username: user.username })
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
        }
  };

  const handleBackupButton = async (day, type) => {
    try {
      const response = await fetch('http://localhost:3001/signup-backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, type, name: user.name, username: user.username })
      });
      const data = await response.json();
      if (data.success) {
        setSchedule(data.schedule);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(`Error signing up as backup ${type}:`, err);
    }
  };

  const isDriverScheduled = (day) => {
    return schedule[day] && schedule[day].slots[0];
  };

  const arePackersScheduled = (day) => {
    return schedule[day] && schedule[day].slots[1] && schedule[day].slots[2] && schedule[day].slots[3];
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const endpoint = isSignup ? 'register' : 'login';
      const body = isSignup ? loginForm : { username: loginForm.username };

      const res = await fetch(`http://localhost:3001/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (data.success) {
        const loggedInUser = { name: data.name, username: data.username };
        setUser(loggedInUser);
        localStorage.setItem("be-there-user", JSON.stringify(loggedInUser));
      } else {
        setLoginError(data.error);
      }
    } catch (err) {
      setLoginError("Failed to connect to server.");
    }
  };

  if (!user) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          className="login-container"
          key={isSignup ? 'signup' : 'login'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <h1>Be There</h1>
          <h2 className="subheading">{isSignup ? "Create a new account" : "Login with your username"}</h2>
          <form className="login-form" onSubmit={handleAuthSubmit}>
            {isSignup && (
              <input
                type="text"
                placeholder="Full Name"
                value={loginForm.name}
                onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                required
              />
            )}
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              required
            />
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit">
              {isSignup ? "Sign Up" : "Login"}
            </motion.button>
          </form>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => {
            setIsSignup(!isSignup);
            setLoginError('');
          }}>
            {isSignup ? "Have an account? Log in" : "New user? Sign up"}
          </motion.button>
          {loginError && <p className="error">{loginError}</p>}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      className="App"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Be There</h1>
      <div className="welcome-user">
      <h2 className="subheading">Welcome {user.name}!</h2>
      <motion.button className="logout"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          localStorage.removeItem("be-there-user");
          setUser(null);
          setLoginForm({ name: '', username: '' });
          setIsSignup(false);
        }}
        style={{ marginBottom: '10px' }}
      >
        Logout
      </motion.button>
      </div>
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
                  <motion.td
                    key={slot}
                    data-day={day}
                    data-slot={slot}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleSlotClick(day, slot)}
                    style={{ cursor: 'pointer' }}
                  >
                    {schedule[day] && schedule[day].slots[slot] ? schedule[day].slots[slot].name : '[Available]'}
                  </motion.td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="button-columns">
          <div className="backup-driver">
            {days.map(day => (
              <motion.button
                key={`driver-${day}`}
                disabled={!isDriverScheduled(day)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleBackupButton(day, "driver")}
              >
                Sign Up as a Backup Driver ({schedule[day]?.backupDrivers?.length || 0})
              </motion.button>
            ))}
          </div>
          <div className="backup-packer">
            {days.map(day => (
              <motion.button
                key={`packer-${day}`}
                disabled={!arePackersScheduled(day)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleBackupButton(day, "packer")}
              >
                Sign Up as a Backup Packer ({schedule[day]?.backupPackers?.length || 0})
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default App;
