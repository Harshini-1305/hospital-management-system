import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function Login() {
  const [role, setRole] = useState("PATIENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
            const res = await loginUser({ email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("userId", res.data.id);
      
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert("Login Failed: " + (err.response?.data?.message || "Invalid Credentials"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #6a00f4 0%, #00d2ff 100%)',
        display: 'flex',
        flexDirection: 'column'
    }}>
        {/* Navigation Bar (Assuming same as Register for consistency) */}
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
                <span style={{ cursor: 'pointer' }}>ABOUT US</span>
                <span style={{ cursor: 'pointer' }}>CONTACT</span>
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

                    <div style={{ marginTop: '80px' }}>
                        <h2 style={{ textAlign: 'center', color: '#666', fontWeight: '400', marginBottom: '40px', fontSize: '2rem' }}>
                            Login as {role.charAt(0) + role.slice(1).toLowerCase()}
                        </h2>

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <input
                                    type="email"
                                    placeholder="Placeholder"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ background: '#f0f0ff' }}
                                />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div style={{ textAlign: 'right', marginTop: '20px' }}>
                                <button 
                                    type="submit" 
                                    className="btn-primary" 
                                    style={{ padding: '12px 60px', borderRadius: '4px' }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "..." : "Login"}
                                </button>
                            </div>
                        </form>

                        <div style={{ marginTop: '40px', textAlign: 'center' }}>
                            <Link to="/register" style={{ fontSize: '0.9rem', color: '#6a00f4', textDecoration: 'none' }}>
                                New to the portal? Create an account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}