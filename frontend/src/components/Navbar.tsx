import { useEffect, useState } from 'react';
import headerBgImage from '../assets/header_bg.jpg';
import { Button, Container, Nav, Offcanvas } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'
import axios from 'axios';

const Navbar=()=>{
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);


    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


    // --- AUTH LOGIC ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    const localUser = localStorage.getItem("user");

    // Scenario 1: if the data is present in local storage
    if (token && localUser) {
      setUser(JSON.parse(localUser));
    }
    
    // Scenario 2: Data not present in local storage
    if (token && !localUser) {
       axios.get(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
       })
       .then(response => {
          const userData = response.data; 
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
       })
       .catch(() => {
          handleLogout();
       });
    }
  }, []);

    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const UserAvatar = ({ name, className }) => {
    const initial = name ? name.charAt(0).toUpperCase() : "?";
    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"];
    const colorClass = colors[name.length % colors.length];


    return (
      <div className={`${className} ${colorClass} text-white flex items-center justify-center font-bold border-2 border-white/50 shadow-sm`}>
        {initial}
      </div>
    );

  }

  // Dashboard link logic based on role
  const dashboardLink = user?.role === "trainer" ? "/trainer" : "/student";


    return (
        <header className="sticky top-0 z-40 bg-fixed">
                <div className="px-4 pt-4">
                  <div className="mx-auto max-w-7xl rounded-full bg-[#6B48AF]/90 backdrop-blur-md shadow-xl border border-white/30" style={{
                    
                                  backgroundImage:
                                    `url(${headerBgImage})`,
                                  position: "relative",
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  backgroundRepeat: "no-repeat",
                                  width: "100%",
                                 }}>
                    <Container className="py-7 px-10 md:px-10">
                      <div className="flex items-center justify-between">
                        
                        {/* 1. LOGO */}
                        <div className="flex items-center gap-3 shrink-0">
                          <Link to="/" className="text-3xl md:text-4xl font-[Good Vibes] font-extrabold tracking-wide relative inline-flex items-center no-underline  transition-transform">
                            <span className="text-[#FFFAF1] bg-clip-text drop-shadow-lg"> LearniLM </span>
                            <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 12, ease: "linear" }} className="inline-block mx-1 text-3xl" > 🌎 </motion.span>
                            <span className="text-[#FFFAF1] bg-clip-text drop-shadow-lg"> World </span>
                          </Link>
                        </div>
        
                        {/* 2. DESKTOP NAV - Changed to lg:flex to prevent leaking on tablets */}
                        <nav className="hidden lg:flex items-center gap-6">
                          
                          <Link to="/about#about" className="text-lg font-medium text-white hover:text-[#CBE56A] transition-colors no-underline whitespace-nowrap">
                            About
                          </Link>
                          <Link to="/about#careers" className="text-lg font-medium text-white hover:text-[#CBE56A] transition-colors no-underline whitespace-nowrap">
                            Careers
                          </Link>
        
                          {user ? (
                            <div className="flex items-center gap-4">
                              {/* User Info */}
                              <Link to={dashboardLink} className="flex items-center gap-3 text-white hover:text-[#CBE56A] transition no-underline group">
                                
                                <UserAvatar 
                                  name={user.name} 
                                  className="w-10 h-10 rounded-full shrink-0" 
                                />
                                
                                <div className="flex flex-col leading-tight max-w-[100px] xl:max-w-none overflow-hidden">
                                    <span className="font-semibold text-sm truncate">{user.name}</span>
                                    <span className="text-[10px] text-gray-200 uppercase tracking-wider truncate">{user.role}</span>
                                </div>
                              </Link>
        
                              <button 
                                onClick={handleLogout} 
                                className="ml-2 px-5 py-2 rounded-full bg-[#F64EBB] text-white text-sm font-semibold shadow hover:bg-pink-600 hover:scale-105 transition whitespace-nowrap"
                              >
                                Log Out
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4">
                              <Link to="/login" className="text-lg font-medium text-[white] hover:text-[#CBE56A] transition-colors no-underline whitespace-nowrap">
                                Sign In
                              </Link>
                              <Link to="/register" className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#F64EBB] text-white text-base font-semibold shadow hover:scale-105 transition no-underline whitespace-nowrap">
                                Get started
                              </Link>
                            </div>
                          )}
                        </nav>
        
                        {/* 3. MOBILE NAV - Changed to lg:hidden */}
                        <div className="lg:hidden">
                          <Button variant="light" onClick={() => setShowOffcanvas(true)} aria-label="Open menu">☰</Button>
                          <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end">
                            <Offcanvas.Header closeButton><Offcanvas.Title>Menu</Offcanvas.Title></Offcanvas.Header>
                            <Offcanvas.Body>
                              <Nav className="flex-column gap-4">
                                <Nav.Link as={Link} to="/about#about" onClick={() => setShowOffcanvas(false)}>About</Nav.Link>
                                <Nav.Link as={Link} to="/about#careers" onClick={() => setShowOffcanvas(false)}>Careers</Nav.Link>
                                
                                {user ? (
                                  <>
                                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                                        <UserAvatar 
                                          name={user.name} 
                                          className="w-10 h-10 rounded-full" 
                                        />
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-gray-800 m-0 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 m-0 uppercase truncate">{user.role}</p>
                                        </div>
                                    </div>
                                    <Nav.Link as={Link} to={dashboardLink} onClick={() => setShowOffcanvas(false)}>Dashboard</Nav.Link>
                                    <div className="mt-2">
                                      <button onClick={() => { handleLogout(); setShowOffcanvas(false); }} className="w-full px-4 py-2 rounded-full bg-[#F64EBB] text-white text-sm font-semibold">
                                        Log Out
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <Nav.Link as={Link} to="/login" onClick={() => setShowOffcanvas(false)}>Sign In</Nav.Link>
                                    <div className="mt-3">
                                      <Link to="/register" onClick={() => setShowOffcanvas(false)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9787F3] text-white text-sm font-semibold">
                                        Get started
                                      </Link>
                                    </div>
                                  </>
                                )}
                              </Nav>
                            </Offcanvas.Body>
                          </Offcanvas>
                        </div>
        
                      </div>
                    </Container>
                  </div>
                </div>
              </header>
    )
}

export default Navbar;