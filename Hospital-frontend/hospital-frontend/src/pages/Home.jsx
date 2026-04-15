import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services/api";

export default function Home() {
  const [contact, setContact] = useState({ userName: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleContactChange = (e) => setContact({ ...contact, [e.target.name]: e.target.value });

  const handleSend = (e) => {
    e.preventDefault();
    axios.post(`${API_BASE_URL}/queries`, {
      userName: contact.userName,
      email: contact.email,
      contact: contact.phone,
      message: contact.message
    }).then(() => {
      setSent(true);
      setContact({ userName: "", email: "", phone: "", message: "" });
    }).catch(() => alert("Failed to send message."));
  };

  const services = [
    { icon: "🏥", title: "Make an appointment", desc: "Lorem ipsum dolor sit amet, nec te mollis utroque honestatis, ut utamur molestiae vix, graecis eligendi ne." },
    { icon: "📋", title: "Choose your package", desc: "Lorem ipsum dolor sit amet, nec te mollis utroque honestatis, ut utamur molestiae vix, graecis eligendi ne." },
    { icon: "👨‍⚕️", title: "Help by specialist", desc: "Lorem ipsum dolor sit amet, nec te mollis utroque honestatis, ut utamur molestiae vix, graecis eligendi ne." },
    { icon: "🏨", title: "Get diagnostic report", desc: "Lorem ipsum dolor sit amet, nec te mollis utroque honestatis, ut utamur molestiae vix, graecis eligendi ne." },
  ];

  const specialties = [
    { icon: "🩺", name: "Medical checkup", desc: "Vestibulum tincidunt enim in pharetra malesuada." },
    { icon: "🏨", name: "Gyn Care", desc: "Vestibulum tincidunt enim in pharetra malesuada." },
    { icon: "♿", name: "Nursing Services", desc: "Vestibulum tincidunt enim in pharetra malesuada." },
    { icon: "🧠", name: "Neurology", desc: "Vestibulum tincidunt enim in pharetra malesuada." },
    { icon: "➕", name: "Pharmacy", desc: "Vestibulum tincidunt enim in pharetra malesuada." },
    { icon: "💙", name: "Sleep Center", desc: "Vestibulum tincidunt enim in pharetra malesuada." },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: "white" }}>

      {/* Navigation Bar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 60px',
        background: 'linear-gradient(90deg, #6a00f4 0%, #00d2ff 100%)',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: 'bold' }}>
          <span style={{ fontSize: '1.3rem' }}>👥+</span> GLOBAL HOSPITALS
        </div>
        <div style={{ display: 'flex', gap: '30px', fontSize: '0.9rem', fontWeight: '500' }}>
          <a href="#home" style={{ color: 'white', textDecoration: 'none' }}>HOME</a>
          <a href="#about" style={{ color: 'white', textDecoration: 'none' }}>ABOUT US</a>
          <a href="#contact" style={{ color: 'white', textDecoration: 'none' }}>CONTACT</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6a00f4 0%, #00d2ff 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '80px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '5rem', marginBottom: '10px' }}>🚀</div>
        <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '20px' }}>Global Hospital</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.85, maxWidth: '600px', marginBottom: '40px', lineHeight: '1.7' }}>
          World-class medical care at your fingertips. Book appointments, consult specialists, and manage your health journey all in one place.
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/register" style={{
            background: 'white', color: '#6a00f4', padding: '14px 40px',
            borderRadius: '30px', fontWeight: '700', textDecoration: 'none', fontSize: '1rem'
          }}>Get Started</Link>
          <Link to="/login" style={{
            background: 'transparent', color: 'white', padding: '14px 40px', border: '2px solid white',
            borderRadius: '30px', fontWeight: '700', textDecoration: 'none', fontSize: '1rem'
          }}>Login</Link>
        </div>
      </section>

      {/* Services Banner — 4 columns */}
      <section id="about" style={{
        background: 'linear-gradient(90deg, #6a00f4 0%, #00d2ff 100%)',
        padding: '60px 80px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', marginBottom: '60px' }}>
          {services.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{s.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>{s.title}</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.8, lineHeight: '1.6' }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Specialties + Doctor Image */}
        <div style={{ display: 'flex', gap: '60px', alignItems: 'flex-start' }}>
          {/* Doctor placeholder */}
          <div style={{
            width: '280px',
            flexShrink: 0,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            fontSize: '8rem',
            overflow: 'hidden'
          }}>
            👨‍⚕️
          </div>
          {/* Grid of specialties */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 40px', flex: 1 }}>
            {specialties.map((sp, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '1.2rem'
                }}>{sp.icon}</div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '4px' }}>{sp.name}</h4>
                  <p style={{ fontSize: '0.78rem', opacity: 0.8, lineHeight: '1.5' }}>{sp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{
        background: 'linear-gradient(135deg, #6a00f4 0%, #00d2ff 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.97)',
          borderRadius: '30px',
          padding: '60px 80px',
          maxWidth: '700px',
          width: '100%',
          textAlign: 'center',
          color: '#333'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🚀</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '400', marginBottom: '40px', color: '#444' }}>
            Drop Us a Message
          </h2>
          {sent ? (
            <div style={{ color: '#22c55e', fontSize: '1.1rem', padding: '30px 0' }}>
              ✅ Message sent successfully!
            </div>
          ) : (
            <form onSubmit={handleSend}>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
                <input
                  name="userName"
                  placeholder="Your Name"
                  value={contact.userName}
                  onChange={handleContactChange}
                  required
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', outline: 'none' }}
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={contact.message}
                  onChange={handleContactChange}
                  required
                  rows={5}
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', resize: 'vertical', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '280px', marginBottom: '24px' }}>
                <input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={contact.email}
                  onChange={handleContactChange}
                  required
                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', outline: 'none' }}
                />
                <input
                  name="phone"
                  placeholder="Your Phone"
                  value={contact.phone}
                  onChange={handleContactChange}
                  required
                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: '#6a00f4', color: 'white', padding: '12px 40px',
                  borderRadius: '25px', border: 'none', cursor: 'pointer',
                  fontSize: '0.95rem', fontWeight: '600'
                }}
              >Send Message</button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
