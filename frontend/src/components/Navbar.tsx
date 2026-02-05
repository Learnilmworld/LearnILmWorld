import { useState } from "react";
import logo from "../assets/logo.png";
import { Button, Nav, Offcanvas } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const dashboardLink = user
    ? user.role === "trainer"
      ? "/trainer"
      : user.role === "admin"
        ? "/admin"
        : "/student"
    : "/login";

  if (loading) return null;

  const isAuthResolved = !loading;

  return (
    <header className="sticky top-0 z-40 overflow-hidden">
      <div className="flex w-full h-[75px] md:h-[85px] bg-[white]">
        {/* LEFT */}
        <div className="w-fit flex items-center pl-2 md:pl-10 pr-0 mr-[-1px]">
          <Link to="/" className="h-full flex items-center">
            <img
              src={logo}
              alt="LearnILM World"
              className="h-full w-auto object-fill block"
            />
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex-1 bg-[white] flex items-center justify-end pr-4 md:pr-10">

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-8">
            {isAuthResolved ? (
              <>
                <Link
                  to="/about#about"
                  className="text-lg font-medium text-[#203989] hover:text-[black] transition no-underline"
                >
                  About
                </Link>
                <Link
                  to="/about#careers"
                  className="text-lg font-medium text-[#203989] hover:text-[black] transition no-underline"
                >
                  Careers
                </Link>

                {user ? (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                      className="text-lg font-medium text-[#203989] hover:text-[black] transition no-underline"
                    >
                      Log Out
                    </button>
                    <Link
                      to={dashboardLink}
                      className="px-6 py-2 rounded-full bg-[#024AAC] text-[white] text-sm font-bold shadow hover:scale-105 transition"
                    >
                      Dashboard
                    </Link>

                  </div>
                ) : (
                  <div className="flex items-center gap-6">
                    <Link
                      to="/login"
                      className="text-lg font-medium text-[#203989] hover:text-[black] transition no-underline"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="px-6 py-2 rounded-full bg-[#024AAC] text-[white] text-base font-bold shadow hover:scale-105 transition no-underline"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </>
            ) : (
              // 👇 Skeleton / placeholder
              <div className="flex gap-6 animate-pulse">
                <div className="h-5 w-20 bg-white/40 rounded" />
                <div className="h-5 w-20 bg-white/40 rounded" />
                <div className="h-9 w-28 bg-white/40 rounded-full" />
              </div>
            )}
          </nav>

          {/* MOBILE MENU */}
          <div className="lg:hidden text-white ml-auto flex items-center">
            <Button
              variant="link"
              className="text-white text-4xl p-0 no-underline"
              onClick={() => setShowOffcanvas(true)}
            >
              ☰
            </Button>

            <Offcanvas
              show={showOffcanvas}
              onHide={() => setShowOffcanvas(false)}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Menu</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="flex-column gap-4">
                  <Nav.Link
                    as={Link}
                    to="/about#about"
                    onClick={() => setShowOffcanvas(false)}
                  >
                    About
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/about#careers"
                    onClick={() => setShowOffcanvas(false)}
                  >
                    Careers
                  </Nav.Link>

                  {user ? (
                    <>
                      <Nav.Link
                        as={Link}
                        to={dashboardLink}
                        onClick={() => setShowOffcanvas(false)}
                      >
                        Dashboard
                      </Nav.Link>
                      <button
                        onClick={() => {
                          logout();
                          navigate("/login");
                          setShowOffcanvas(false);
                        }}
                        className="w-full mt-2 px-4 py-2 rounded-full bg-[#276dc9] text-white font-bold"
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Nav.Link
                        as={Link}
                        to="/login"
                        onClick={() => setShowOffcanvas(false)}
                      >
                        Sign In
                      </Nav.Link>
                      <Link
                        to="/register"
                        onClick={() => setShowOffcanvas(false)}
                        className="w-full mt-2 block text-center px-4 py-2 rounded-full bg-[#276dc9] text-white font-bold no-underline"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </Nav>
              </Offcanvas.Body>
            </Offcanvas>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;