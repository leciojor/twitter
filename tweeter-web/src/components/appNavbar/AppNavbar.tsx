import "./AppNavbar.css";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { AuthToken } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserActions, useUserInfo } from "../userInfo/UserHooks";
import { useRef } from "react";
import {
  AppNavBarView,
  AppNavBarPresenter,
} from "../../presenter/AppNavBarPresenter";

const AppNavbar = () => {
  const location = useLocation();
  const { authToken, displayedUser } = useUserInfo();
  const { clearUserInfo } = useUserActions();
  const navigate = useNavigate();
  const { displayInfoMessage, displayErrorMessage, deleteMessage } =
    useMessageActions();

  const listener: AppNavBarView = {
    displayInfoMessage: displayInfoMessage,
    displayErrorMessage: displayErrorMessage,
    navigateTo: (path: string) => navigate(path),
    deleteMessage: deleteMessage,
    clearUserInfo: clearUserInfo,
  };

  const presenterRef = useRef<AppNavBarPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new AppNavBarPresenter(listener);
  }

  return (
    <Navbar
      collapseOnSelect
      className="mb-4"
      expand="md"
      bg="primary"
      variant="dark"
    >
      <Container>
        <Navbar.Brand>
          <div className="d-flex flex-row">
            <div className="p-2">
              <NavLink className="brand-link" to="/">
                <Image src={"/bird-white-32.png"} alt="" />
              </NavLink>
            </div>
            <div id="brand-title" className="p-3">
              <NavLink className="brand-link" to="/">
                <b>Tweeter</b>
              </NavLink>
            </div>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Item>
              <NavLink
                to={`/feed/${displayedUser!.alias}`}
                className={() =>
                  location.pathname.startsWith("/feed/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Feed
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to={`/story/${displayedUser!.alias}`}
                className={() =>
                  location.pathname.startsWith("/story/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Story
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to={`/followees/${displayedUser!.alias}`}
                className={() =>
                  location.pathname.startsWith("/followees/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Followees
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to={`/followers/${displayedUser!.alias}`}
                className={() =>
                  location.pathname.startsWith("/followers/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Followers
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                id="logout"
                onClick={() => presenterRef.current!.logOut(authToken!)}
                to={location.pathname}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Logout
              </NavLink>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
