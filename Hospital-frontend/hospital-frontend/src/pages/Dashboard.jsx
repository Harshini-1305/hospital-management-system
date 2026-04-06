import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [view, setView] = useState("dashboard");
  
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name") || "User";

  // Booking Form State (Patient)
  const [selDocId, setSelDocId] = useState("");
  const [selDate, setSelDate] = useState("");
  const [selTime, setSelTime] = useState("");
  const [fees, setFees] = useState(0);

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [docSearchTerm, setDocSearchTerm] = useState("");
  const [queries, setQueries] = useState([]);
  const [deleteEmail, setDeleteEmail] = useState("");
  
  // Add Doctor Form State
  const [docData, setDocData] = useState({
      name: "",
      password: "",
      confirmPassword: "",
      email: "",
      specialization: "",
      fees: ""
  });

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    loadDoctors();
    loadAppointments();
    if (role === 'ADMIN') { loadPatients(); loadQueries(); }
  }, []);

  const loadDoctors = () => {
    axios.get("http://localhost:8080/doctors", { headers: { Authorization: `Bearer ${token}` }})
    .then(res => setDoctors(res.data))
    .catch(err => console.log(err));
  };

  const loadAppointments = () => {
    axios.get("http://localhost:8080/appointments", { headers: { Authorization: `Bearer ${token}` }})
    .then(res => setAppointments(res.data))
    .catch(err => console.log(err));
  };

  const loadPatients = () => {
    axios.get("http://localhost:8080/auth/users", { headers: { Authorization: `Bearer ${token}` }})
    .then(res => setPatients(res.data.filter(u => u.role === 'PATIENT')))
    .catch(err => console.log(err));
  };

  const loadQueries = () => {
    axios.get("http://localhost:8080/queries", { headers: { Authorization: `Bearer ${token}` }})
    .then(res => setQueries(res.data))
    .catch(err => console.log(err));
  };

  const handleCancelAppointment = (appId) => {
    const cancelStatus = role === 'DOCTOR' ? 'Cancelled by Doctor' : 'Cancelled by You';
    axios.put(`http://localhost:8080/appointments/${appId}/status`, cancelStatus,
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'text/plain' }}
    ).then(() => loadAppointments());
  };

  const handleDeleteDoctor = (e) => {
    e.preventDefault();
    if (!deleteEmail) return alert("Please enter an Email ID");
    axios.delete(`http://localhost:8080/doctors/by-email?email=${deleteEmail}`,
      { headers: { Authorization: `Bearer ${token}` }}
    ).then(() => {
      alert("Doctor deleted successfully!");
      setDeleteEmail("");
      loadDoctors();
    }).catch(() => alert("Doctor not found or error deleting."));
  };

  const handleDocChange = (e) => {
      setDocData({ ...docData, [e.target.name]: e.target.value });
  };

  const handleAddDoctor = (e) => {
      e.preventDefault();
      if (docData.password !== docData.confirmPassword) return alert("Passwords do not match!");
      axios.post("http://localhost:8080/doctors", 
        { name: docData.name, email: docData.email, specialization: docData.specialization, fees: docData.fees, password: docData.password },
        { headers: { Authorization: `Bearer ${token}` }}
      ).then(() => { 
          alert("Doctor Added Successfully!"); 
          loadDoctors(); 
          setView("doctor_list"); 
          setDocData({ name: "", password: "", confirmPassword: "", email: "", specialization: "", fees: "" });
      });
  };
  

  const handleDoctorSelect = (e) => {
    const docId = e.target.value;
    setSelDocId(docId);
    const doc = doctors.find(d => String(d.id) === String(docId));
    setFees(doc ? doc.fees : 0);
  };

  const handleBook = () => {
    if (!selDocId || !selDate || !selTime) return alert("Please fill all fields.");
    axios.post("http://localhost:8080/appointments",
      { doctor: { id: selDocId }, date: selDate, time: selTime, consultancyFees: fees, status: "Active" },
      { headers: { Authorization: `Bearer ${token}` }}
    ).then(() => {
      alert("Appointment booked successfully!");
      setSelDocId(""); setSelDate(""); setSelTime(""); setFees(0);
      loadAppointments();
      setView("history");
    }).catch(err => {
      const msg = err.response?.data || "Server error";
      alert("Booking failed: " + msg);
    });
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const isDocPasswordMatching = docData.password && docData.confirmPassword && docData.password === docData.confirmPassword;

  // Filtering logic
  const filteredPatients = patients.filter(p => p.contact?.includes(searchTerm));
  const filteredDoctors = doctors.filter(d => d.email?.includes(searchTerm));
  const filteredAppDetails = appointments.filter(a => a.user?.contact?.includes(searchTerm));
  const filteredDocApps = appointments.filter(a =>
    a.user?.contact?.toLowerCase().includes(docSearchTerm.toLowerCase())
  );
  const filteredQueries = queries.filter(q => q.contact?.includes(searchTerm));

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "white" }}>
      {/* Header Bar */}
      <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '10px 40px', 
          background: 'linear-gradient(90deg, #6a00f4 0%, #00d2ff 100%)', 
          color: 'white' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', fontWeight: 'bold' }}>
                <span>👥+</span> GLOBAL HOSPITAL
            </div>
            <button onClick={handleLogout} style={{ background: 'transparent', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🚪</span> Logout
            </button>
        </div>
        {role === 'DOCTOR' && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              placeholder="Enter contact number"
              value={docSearchTerm}
              onChange={(e) => setDocSearchTerm(e.target.value)}
              style={{ width: '220px', padding: '6px 12px', borderRadius: '4px', border: 'none', color: '#333' }}
            />
            <button style={{ background: '#00d2ff', color: 'white', padding: '6px 20px', borderRadius: '4px', fontWeight: '600', border: 'none' }}>Search</button>
          </div>
        )}
      </header>

      <main style={{ flex: 1, padding: "0 40px" }}>
        <h1 style={{ fontSize: "1.8rem", textAlign: "center", margin: "40px 0", fontWeight: "400", color: "#555", textTransform: role === 'ADMIN' ? 'uppercase' : 'none' }}>
            {role === 'ADMIN' ? 'WELCOME ADMIN' : `Welcome ${name}`}
        </h1>

        <div style={{ display: "flex", gap: "20px" }}>
          <div>
            <Sidebar setView={setView} activeView={view} />
          </div>
          
          <div style={{ flex: 1, padding: "40px" }}>
            {/* Dashboard Default Views */}
            {view === 'dashboard' && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', marginTop: '40px', flexWrap: 'wrap' }}>
                    {role === 'ADMIN' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px 100px', maxWidth: '800px', width: '100%' }}>
                            <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setView('doctor_list')}>
                                <div style={{ background: '#6a00f4', color: 'white', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '1.5rem' }}>
                                    <span>👥</span>
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '400', color: '#555' }}>Doctor List</h3>
                                <p style={{ color: '#6a00f4', fontSize: '0.85rem' }}>View Doctors</p>
                            </div>

                            <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setView('patient_list')}>
                                <div style={{ background: '#6a00f4', color: 'white', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '1.5rem' }}>
                                    <span>👥</span>
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '400', color: '#555' }}>Patient List</h3>
                                <p style={{ color: '#6a00f4', fontSize: '0.85rem' }}>View Patients</p>
                            </div>

                            <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setView('app_details')}>
                                <div style={{ background: '#6a00f4', color: 'white', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '1.5rem' }}>
                                    <span>📎</span>
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '400', color: '#555' }}>Appointment Details</h3>
                                <p style={{ color: '#6a00f4', fontSize: '0.85rem' }}>View Appointments</p>
                            </div>

                            <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setView('add_doctor')}>
                                <div style={{ background: '#6a00f4', color: 'white', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '1.5rem' }}>
                                    <span>+</span>
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '400', color: '#555' }}>Manage Doctors</h3>
                                <p style={{ color: '#6a00f4', fontSize: '0.85rem' }}>Add Doctors</p>
                            </div>
                        </div>
                    )}
                    
                    {role === 'PATIENT' && (
                        <div style={{ display: 'flex', gap: '80px', justifyContent: 'center', width: '100%' }}>
                            <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setView('book')}>
                                <div style={{ background: '#6a00f4', color: 'white', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                    {'>_'}
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '400', color: '#555' }}>Book My Appointment</h3>
                                <p style={{ color: '#6a00f4', fontSize: '0.85rem' }}>Book Appointment</p>
                            </div>
                            <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setView('history')}>
                                <div style={{ background: '#6a00f4', color: 'white', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '1.5rem' }}>
                                    <span>📎</span>
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '400', color: '#555' }}>My Appointments</h3>
                                <p style={{ color: '#6a00f4', fontSize: '0.85rem' }}>View Appointment History</p>
                            </div>
                        </div>
                    )}

                    {role === 'DOCTOR' && (
                        <div style={{ display: 'flex', gap: '80px', justifyContent: 'center', width: '100%' }}>
                            <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setView('appointments')}>
                                <div style={{ background: '#6a00f4', color: 'white', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fill: 'white' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M4 6h2v2H4zm0 5h2v2H4zm0 5h2v2H4zm16-8V6H8.023v2H18.8zM8 11h12v2H8zm0 5h12v2H8z"/></svg>
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '400', color: '#555' }}>View Appointments</h3>
                                <p style={{ color: '#6a00f4', fontSize: '0.85rem' }}>Appointment List</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Patient List View */}
            {view === 'patient_list' && (
                <div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                        <input placeholder="Enter Contact" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ maxWidth: '400px' }} />
                        <button style={{ background: '#6a00f4', color: 'white', padding: '10px 30px', borderRadius: '4px' }}>Search</button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '15px 10px', color: '#333' }}>First Name</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Last Name</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Email</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Contact</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Gender</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{p.firstName}</td>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{p.lastName}</td>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{p.email}</td>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{p.contact}</td>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{p.gender}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Doctor List View */}
            {view === 'doctor_list' && (
                <div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                        <input placeholder="Enter Email ID" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ maxWidth: '400px' }} />
                        <button style={{ background: '#6a00f4', color: 'white', padding: '10px 30px', borderRadius: '4px' }}>Search</button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Doctor Name</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDoctors.map(d => (
                                <tr key={d.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{d.name}</td>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{d.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Appointment Details View */}
            {view === 'app_details' && (
                <div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                        <input placeholder="Enter Contact" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ maxWidth: '400px' }} />
                        <button style={{ background: '#6a00f4', color: 'white', padding: '10px 30px', borderRadius: '4px' }}>Search</button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '15px 10px', color: '#333' }}>First Name</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Last Name</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Email</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Contact</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Doctor Name</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Consultancy Fees</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Appointment Date</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Appointment Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppDetails.map(a => (
                                <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{a.user?.firstName}</td>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{a.user?.lastName}</td>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{a.user?.email}</td>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{a.user?.contact}</td>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{a.doctor?.name}</td>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{a.consultancyFees}</td>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{a.date}</td>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{a.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Doctor View */}
            {view === 'add_doctor' && (
                <div style={{ maxWidth: '800px' }}>
                    <form onSubmit={handleAddDoctor} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '25px', alignItems: 'center' }}>
                        <label style={{ color: '#555' }}>Doctor Name:</label>
                        <input name="name" value={docData.name} onChange={handleDocChange} required />

                        <label style={{ color: '#555' }}>Password:</label>
                        <input name="password" type="password" value={docData.password} onChange={handleDocChange} required />

                        <label style={{ color: '#555' }}>Confirm Password:</label>
                        <div style={{ position: 'relative' }}>
                            <input name="confirmPassword" type="password" value={docData.confirmPassword} onChange={handleDocChange} required />
                            {isDocPasswordMatching && <span style={{ position: 'absolute', bottom: '-20px', left: '0', fontSize: '0.75rem', color: '#22c55e' }}>Matching</span>}
                        </div>

                        <label style={{ color: '#555' }}>Email ID:</label>
                        <input name="email" type="email" value={docData.email} onChange={handleDocChange} required />

                        <label style={{ color: '#555' }}>Select Doctor Specialization</label>
                        <select name="specialization" value={docData.specialization} onChange={handleDocChange} required style={{ border: '1px solid #ccc', borderRadius: '4px', outline: 'none' }}>
                            <option value="">Select Specialization</option>
                            <option value="Cardiology">Cardiology</option>
                            <option value="Neurology">Neurology</option>
                            <option value="Orthopedics">Orthopedics</option>
                            <option value="Dermatology">Dermatology</option>
                            <option value="Pediatrics">Pediatrics</option>
                            <option value="General Medicine">General Medicine</option>
                        </select>

                        <label style={{ color: '#555' }}>Consultancy Fees:</label>
                        <input name="fees" type="number" value={docData.fees} onChange={handleDocChange} required />

                        <div></div>
                        <div style={{ marginTop: '20px' }}>
                            <button type="submit" className="btn-primary" style={{ borderRadius: '4px', padding: '10px 40px' }}>Add Doctor</button>
                        </div>
                    </form>
                </div>
            )}
            {view === 'book' && (
                <div className="card" style={{ maxWidth: '800px', border: '1px solid #eee', padding: '40px' }}>
                    <h2 style={{ textAlign: 'center', fontWeight: '400', color: '#555', marginBottom: '40px' }}>Create an appointment</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px', alignItems: 'center' }}>
                        <label style={{ color: '#555' }}>Doctors:</label>
                        <select value={selDocId} onChange={handleDoctorSelect} style={{ background: 'white' }}>
                            <option value="">-- Select --</option>
                            {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>

                        <label style={{ color: '#555' }}>Consultancy Fees</label>
                        <input value={fees} disabled style={{ background: '#e9ecef', border: '1px solid #ccc' }} />

                        <label style={{ color: '#555' }}>Date</label>
                        <input type="date" value={selDate} onChange={(e) => setSelDate(e.target.value)} />

                        <label style={{ color: '#555' }}>Time</label>
                        <input type="time" value={selTime} onChange={(e) => setSelTime(e.target.value)} />

                        <div></div>
                        <div style={{ marginTop: '20px' }}>
                            <button onClick={handleBook} className="btn-primary" style={{ borderRadius: '4px' }}>Create new entry</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Patient Appointment History View */}
            {view === 'history' && (
                <div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Doctor Name</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Consultancy Fees</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Appointment Date</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Appointment Time</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Current Status</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length === 0 && (
                                <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No appointment history found.</td></tr>
                            )}
                            {appointments.map(app => (
                                <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{app.doctor?.name}</td>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{app.consultancyFees}</td>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{app.date}</td>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{app.time}</td>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{app.status || 'Active'}</td>
                                    <td style={{ padding: '15px 10px' }}>
                                        {(app.status === 'Active' || !app.status) ? (
                                            <button
                                                onClick={() => handleCancelAppointment(app.id)}
                                                style={{ background: '#ef4444', color: 'white', padding: '6px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                                            >Cancel</button>
                                        ) : (
                                            <span style={{ color: '#666' }}>Cancelled</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Doctor Appointments View (with Cancel) */}
            {view === 'appointments' && role === 'DOCTOR' && (
                <div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '15px 8px', color: '#333' }}>First Name</th>
                                <th style={{ padding: '15px 8px', color: '#333' }}>Last Name</th>
                                <th style={{ padding: '15px 8px', color: '#333' }}>Gender</th>
                                <th style={{ padding: '15px 8px', color: '#333' }}>Email</th>
                                <th style={{ padding: '15px 8px', color: '#333' }}>Contact</th>
                                <th style={{ padding: '15px 8px', color: '#333' }}>Appointment Date</th>
                                <th style={{ padding: '15px 8px', color: '#333' }}>Appointment Time</th>
                                <th style={{ padding: '15px 8px', color: '#333' }}>Current Status</th>
                                <th style={{ padding: '15px 8px', color: '#333' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDocApps.length === 0 && (
                                <tr><td colSpan="9" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No patient appointments found.</td></tr>
                            )}
                            {filteredDocApps.map(app => (
                                <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px 8px', color: '#666' }}>{app.user?.firstName}</td>
                                    <td style={{ padding: '15px 8px', color: '#666' }}>{app.user?.lastName}</td>
                                    <td style={{ padding: '15px 8px', color: '#666' }}>{app.user?.gender || 'N/A'}</td>
                                    <td style={{ padding: '15px 8px', color: '#666' }}>{app.user?.email}</td>
                                    <td style={{ padding: '15px 8px', color: '#666' }}>{app.user?.contact}</td>
                                    <td style={{ padding: '15px 8px', color: '#666' }}>{app.date}</td>
                                    <td style={{ padding: '15px 8px', color: '#666' }}>{app.time}</td>
                                    <td style={{ padding: '15px 8px', color: '#666' }}>
                                        {(() => {
                                            const s = app.status;
                                            if (!s || s === 'Active') return 'Active';
                                            if (s === 'Cancelled by Doctor') return 'Cancelled by You';
                                            if (s === 'Cancelled by You') return 'Cancelled by Patient';
                                            return s;
                                        })()}
                                    </td>
                                    <td style={{ padding: '15px 8px' }}>
                                        {(app.status === 'Active' || !app.status) ? (
                                            <button
                                                onClick={() => handleCancelAppointment(app.id)}
                                                style={{ background: '#ef4444', color: 'white', padding: '6px 14px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                                            >Cancel</button>
                                        ) : (
                                            <span style={{ color: '#666' }}>Cancelled</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Delete Doctor View */}
            {view === 'delete_doctor' && (
                <div style={{ maxWidth: '800px' }}>
                    <form onSubmit={handleDeleteDoctor} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '25px', alignItems: 'center' }}>
                        <label style={{ color: '#555' }}>Email ID:</label>
                        <input
                            type="email"
                            placeholder="Enter doctor email"
                            value={deleteEmail}
                            onChange={(e) => setDeleteEmail(e.target.value)}
                            required
                        />
                        <div></div>
                        <div style={{ marginTop: '10px' }}>
                            <button type="submit" className="btn-primary" style={{ borderRadius: '4px', padding: '10px 40px', background: '#6a00f4' }}>Delete Doctor</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Queries / Messages View */}
            {view === 'messages' && (
                <div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                        <input placeholder="Enter Contact" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ maxWidth: '400px' }} />
                        <button style={{ background: '#6a00f4', color: 'white', padding: '10px 30px', borderRadius: '4px', border: 'none' }}>Search</button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '15px 10px', color: '#333' }}>User Name</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Email</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Contact</th>
                                <th style={{ padding: '15px 10px', color: '#333' }}>Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQueries.length === 0 && (
                                <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No messages found.</td></tr>
                            )}
                            {filteredQueries.map(q => (
                                <tr key={q.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{q.userName}</td>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{q.email}</td>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{q.contact}</td>
                                    <td style={{ padding: '15px 10px', color: '#666' }}>{q.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;