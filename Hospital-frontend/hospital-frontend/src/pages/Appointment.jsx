import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Appointment.css";

function Appointment() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [isBooking, setIsBooking] = useState(false);

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  // Load doctors
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    axios.get("http://localhost:8080/doctors", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setDoctors(res.data))
    .catch(err => console.log(err));
  }, []);

  // Load appointments
  useEffect(() => {
    axios.get("http://localhost:8080/appointments", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setAppointments(res.data))
    .catch(err => console.log(err));
  }, []);

  // Book appointment
  const bookAppointment = async () => {
    if (!doctorId || !date) {
      alert("Please select a doctor and date! 🏥");
      return;
    }

    setIsBooking(true);
    try {
      await axios.post(
        "http://localhost:8080/appointments",
        {
          doctor: { id: doctorId },
          date: date,
          status: "BOOKED"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert("Booking Successful! 📅");
      
      const res = await axios.get("http://localhost:8080/appointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
      setDoctorId("");
      setDate("");

    } catch (err) {
      console.log(err);
      alert("Booking Failed ❌");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div style={{ marginBottom: "32px" }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>← Back to Dashboard</Link>
        <h2 style={{ marginTop: "16px", fontSize: '2.5rem', color: "var(--primary)" }}>Reserve a Consultation 🩺</h2>
        <p style={{ color: "var(--text-light)" }}>Choose your doctor and preferred date for a visit.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        
        {/* Booking Form Card */}
        <div className="card" style={{ height: "fit-content" }}>
          <h3 style={{ marginBottom: "24px" }}>📅 New Appointment Details</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: "8px", display: "block" }}>Select Your Specialist</label>
              <select onChange={(e) => setDoctorId(e.target.value)} value={doctorId}>
                <option value="">-- Choose a Doctor --</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: "8px", display: "block" }}>Select Consultation Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <button 
              onClick={bookAppointment} 
              className="btn-primary" 
              style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: "1.1rem" }}
              disabled={isBooking}
            >
              {isBooking ? "Reserved..." : "Confirm Booking"}
            </button>
          </div>
        </div>

        {/* My Appointments List Card */}
        <div className="card">
          <h3 style={{ marginBottom: "24px" }}>🕒 Your Scheduled Visits</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {appointments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--text-light)" }}>
                <span style={{ fontSize: "3rem" }}>📅</span>
                <p>No appointments booked yet.</p>
              </div>
            ) : appointments.map(app => (
              <div key={app.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", border: "1px solid var(--border)", borderRadius: "12px", background: "#f8fafc" }}>
                <div>
                  <h4 style={{ color: "var(--text-dark)", marginBottom: "4px" }}>Dr. {app.doctor?.name || "Specialist"}</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>{app.date}</p>
                </div>
                <span className="badge badge-success">{app.status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Appointment;
