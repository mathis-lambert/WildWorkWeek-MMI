import {Link} from "react-router-dom";
import "./Navbar.scss";
import {useLocation} from "react-router-dom";

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <ul className="navbar-menu">
                <li className={`navbar-item ${location.pathname === "/" ? "active" : ""}`}>
                    <Link to="/">
                        Profil
                    </Link>
                </li>
                <li className={`navbar-item ${location.pathname === "/mmi" ? "active" : ""}`}>
                    <Link to="/mmi">
                        MMI
                    </Link>
                </li>
                {/*<li className={`navbar-item ${location.pathname === "/projects" ? "active" : ""}`}>*/}
                {/*    <Link to="/projects">*/}
                {/*        Projets*/}
                {/*    </Link>*/}
                {/*</li>*/}
            </ul>
        </nav>
    );
}

export default Navbar;