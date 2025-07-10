import React, { useState, useEffect } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [location, setLocation] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [audio] = useState(() => new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg'));

  const handleSubmit = () => {
    if (name && phone) setSubmitted(true);
  };

  useEffect(() => {
    if (!submitted) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = pos.coords;
        setLocation({ lat: coords.latitude, lng: coords.longitude });
        setSpeed(coords.speed ? Math.round(coords.speed * 3.6) : 0);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [submitted]);

  useEffect(() => {
    if (speed > 100) {
      audio.play();
    }
  }, [speed]);

  if (!submitted) {
    return (
      <div>
        <h2>ورود راننده</h2>
        <input type="text" placeholder="نام" value={name} onChange={(e) => setName(e.target.value)} />
        <br />
        <input type="text" placeholder="شماره تماس" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <br />
        <button onClick={handleSubmit}>ورود</button>
      </div>
    );
  }

  return (
    <div>
      <h2>ردیاب هوشمند خودرو</h2>
      <p>نام راننده: {name}</p>
      <p>شماره تماس: {phone}</p>
      {location ? (
        <div>
          <p>موقعیت فعلی: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
          <p style={{ color: speed > 100 ? 'red' : 'black' }}>
            سرعت فعلی: {speed} km/h {speed > 100 && '🚨 سرعت غیرمجاز!'}
          </p>
        </div>
      ) : (
        <p>در حال دریافت موقعیت...</p>
      )}
    </div>
  );
}