import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Register() {
  const [role, setRole] = useState("PATIENT");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    gender: "Male"
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        return alert("Passwords do not match!");
    }
    setIsLoading(true);

    try {
            await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        contact: formData.contact,
        password: formData.password,
        gender: formData.gender,
        role: role,
      });
      alert("Registration Successful!");
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert("Registration Failed: " + (err.response?.data?.message || "Invalid Input"));
    } finally {
      setIsLoading(false);
    }
  };

  const isPasswordMatching = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #6a00f4 0%, #00d2ff 100%)',
        display: 'flex',
        flexDirection: 'column'
    }}>
        {/* Navigation Bar */}
        <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '20px 60px',
            color: 'white'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                <span style={{ fontSize: '1.5rem' }}>👥+</span> GLOBAL HOSPITALS
            </div>
            <div style={{ display: 'flex', gap: '30px', fontSize: '0.9rem', fontWeight: '500' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>HOME</Link>
                <a href="/#about" style={{ color: 'white', textDecoration: 'none' }}>ABOUT US</a>
                <a href="/#contact" style={{ color: 'white', textDecoration: 'none' }}>CONTACT</a>
            </div>
        </nav>

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ display: 'flex', width: '1000px', minHeight: '550px' }}>
                {/* Left Side: Welcome */}
                <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '100px', marginBottom: '20px' }}>🚀</div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '300', color: 'white' }}>Welcome</h1>
                </div>

                {/* Right Side: Form Card */}
                <div style={{ 
                    flex: 1.5, 
                    background: 'white', 
                    borderRadius: '150px 40px 40px 150px',
                    padding: '40px 60px',
                    position: 'relative'
                }}>
                    {/* Role Tabs */}
                    <div style={{ 
                        position: 'absolute', 
                        top: '40px', 
                        right: '60px',
                        display: 'flex',
                        background: '#6a00f4',
                        padding: '4px',
                        borderRadius: '25px'
                    }}>
                        {["PATIENT", "DOCTOR", "ADMIN"].map((r) => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '20px',
                                    background: role === r ? 'white' : 'transparent',
                                    color: role === r ? '#6a00f4' : 'white',
                                    fontSize: '0.8rem',
                                    fontWeight: '600'
                                }}
                            >
                                {r.charAt(0) + r.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>

                    <div style={{ marginTop: '60px' }}>
                        <h2 style={{ textAlign: 'center', color: '#666', fontWeight: '400', marginBottom: '30px' }}>
                            Register as {role.charAt(0) + role.slice(1).toLowerCase()}
                        </h2>

                        <form onSubmit={handleRegister}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <input 
                                    name="firstName" 
                                    placeholder="First Name *" 
                                    required 
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                                <input 
                                    name="lastName" 
                                    placeholder="Last Name *" 
                                    required 
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <input 
                                    name="email" 
                                    type="email" 
                                    placeholder="Your Email *" 
                                    required 
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <input 
                                    name="contact" 
                                    placeholder="Your Phone *" 
                                    required 
                                    value={formData.contact}
                                    onChange={handleChange}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <input 
                                    name="password" 
                                    type="password" 
                                    placeholder="Password *" 
                                    required 
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        name="confirmPassword" 
                                        type="password" 
                                        placeholder="Confirm Password *" 
                                        required 
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        style={{ borderColor: isPasswordMatching ? '#22c55e' : '#ddd' }}
                                    />
                                    {isPasswordMatching && (
                                        <span style={{ position: 'absolute', bottom: '-18px', left: '0', fontSize: '0.7rem', color: '#22c55e' }}>Matching</span>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px', color: '#666' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input 
                                        type="radio" 
                                        name="gender" 
                                        value="Male" 
                                        checked={formData.gender === "Male"}
                                        onChange={handleChange}
                                        style={{ width: 'auto' }}
                                    /> Male
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input 
                                        type="radio" 
                                        name="gender" 
                                        value="Female" 
                                        checked={formData.gender === "Female"}
                                        onChange={handleChange}
                                        style={{ width: 'auto' }}
                                    /> Female
                                </label>
                            </div>

                            <Link to="/login" style={{ fontSize: '0.9rem', color: '#6a00f4', textDecoration: 'none', display: 'block', marginBottom: '30px' }}>
                                Already have an account?
                            </Link>

                            <div style={{ textAlign: 'right' }}>
                                <button 
                                    type="submit" 
                                    className="btn-primary" 
                                    style={{ padding: '10px 40px' }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "..." : "Register"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

