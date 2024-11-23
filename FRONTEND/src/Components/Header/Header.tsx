import { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { MdAutoGraph } from "react-icons/md";
import { FaBookOpen, FaEdit, FaHome, FaUserCircle, FaUsers } from "react-icons/fa";
import { HiComputerDesktop } from "react-icons/hi2";
import { GrProjects } from "react-icons/gr";
import { IoMail } from "react-icons/io5";
import { CiDark, CiLight } from "react-icons/ci";
import "./Header.css";
import { IoMdDownload } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineRssFeed } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { getItem } from "../../Utilities/storage";
import { MdLogout } from "react-icons/md";
import { API_URL_CONSTANT, ROUTER_URL_CONSTANT } from "../../Utilities/constants";
import { deleteItem } from "../../Utilities/storage";

const authStatus = getItem("token");

const Header = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.className = theme === "light" ? "light-theme" : "";
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  const [expanded, setExpanded] = useState(false);

  const navLinks = authStatus ? [
    // { id: 1, name: "Home", icon: <FaHome />, navlink: "/" },
    { id: 2, name: "Feed", icon: <MdOutlineRssFeed />, navlink: "/allPosts" },
    { id: 3, name: "Create Post", icon: <FaPlus  />, navlink: "/post_article" },
    { id: 5, name: "My Feed", icon: <FaRegUser />, navlink: "/dashboard" },
    { id: 6, name: "Log Out", icon: <MdLogout />, navlink: "" }
  ] :
  [
    { id: 1, name: "Feed", icon: <MdOutlineRssFeed />, navlink: "/allPosts" },
    { id: 2, name: "Create Post", icon: <FaPlus  />, navlink: "/post_article" },
    { id: 3, name: "Get Started", icon: <FaRegUser />, navlink: "/signin" }
  ];
  
  const handleLogout = () => {
    deleteItem("token")
    window.location.href = ROUTER_URL_CONSTANT.ALLPOSTS;
  };

  const handleLinkClick = (event: React.MouseEvent, linkName: string) => {
    setExpanded(false);
    if (linkName === "Log Out") {
      event.preventDefault(); // Prevent navigation for "Log Out"
      handleLogout(); // Call the logout function
    }
  };

  return (
    <Navbar expanded={expanded} expand="lg" className="header-section">
      <Container>
        <Navbar.Brand href="#" className="text-light">
          <span className="heading-font">
            <a className="color-primary" href="/">
              BlogHeaven
            </a>
          </span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="custom-toggler"
          onClick={() => setExpanded(!expanded)}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex gap-4">
            {navLinks.map((link) => (
              <Nav.Link
                key={link.id}
                href={link.navlink}
                className="link"
                onClick={(event) => handleLinkClick(event, link.name)}
              >
                {link.icon} {link.name}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
