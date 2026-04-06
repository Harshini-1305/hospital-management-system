import { useNavigate } from "react-router-dom";

export default function Sidebar({ setView, activeView }) {
  const role = localStorage.getItem("role");

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', roles: ['ADMIN', 'DOCTOR', 'PATIENT'] },
    { id: 'doctor_list', label: 'Doctor List', roles: ['ADMIN'] },
    { id: 'patient_list', label: 'Patient List', roles: ['ADMIN'] },
    { id: 'app_details', label: 'Appointment Details', roles: ['ADMIN'] },
    { id: 'add_doctor', label: 'Add Doctor', roles: ['ADMIN'] },
    { id: 'delete_doctor', label: 'Delete Doctor', roles: ['ADMIN'] },
    { id: 'messages', label: 'Messages', roles: ['ADMIN'] },
    { id: 'book', label: 'Book Appointment', roles: ['PATIENT'] },
    { id: 'appointments', label: 'Appointments', roles: ['DOCTOR'] },
    { id: 'history', label: 'Appointment History', roles: ['PATIENT'] },
  ];



  return (
    <div style={{ 
        width: '240px', 
        background: 'white', 
        border: '1px solid #eee', 
        height: 'fit-content',
        margin: '40px'
    }}>
      {menuItems.filter(item => item.roles.includes(role)).map(item => (
        <div 
          key={item.id}
          onClick={() => setView(item.id)}
          style={{ 
            padding: '12px 20px', 
            cursor: 'pointer', 
            background: activeView === item.id ? '#6a00f4' : 'white',
            color: activeView === item.id ? 'white' : '#666',
            fontSize: '0.9rem',
            borderBottom: '1px solid #eee'
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}

