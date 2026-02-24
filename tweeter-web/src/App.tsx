import "./App.css";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { useUserInfo } from "./components/userInfo/UserHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { Status, User } from "tweeter-shared";
import { PagedItemView } from "./presenter/PagedItemPresenters";
import ItemScroller from "./components/mainLayout/ItemScroller";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  function makeStatusItemFactory(path: string) {
    return (item: Status) => <StatusItem item={item} featurePath={path} />;
  }

  function makeUserItemFactory(path: string) {
    return (item: User) => <UserItem user={item} featurePath={path} />;
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
        <Route
          path="feed/:displayedUser"
          element={
            <ItemScroller<Status>
              key={`feed=${displayedUser!.alias}`}
              featureUrl="/feed"
              presenterFactory={(view: PagedItemView<Status>) =>
                new FeedPresenter(view)
              }
              itemComponentFactory={makeStatusItemFactory("/feed")}
            />
          }
        />
        <Route
          path="story/:displayedUser"
          element={
            <ItemScroller<Status>
              key={`story=${displayedUser!.alias}`}
              featureUrl="/story"
              presenterFactory={(view: PagedItemView<Status>) =>
                new StoryPresenter(view)
              }
              itemComponentFactory={makeStatusItemFactory("/story")}
            />
          }
        />
        <Route
          path="followees/:displayedUser"
          element={
            <ItemScroller<User>
              key={`followees=${displayedUser!.alias}`}
              presenterFactory={(view: PagedItemView<User>) =>
                new FolloweePresenter(view)
              }
              featureUrl="/followees"
              itemComponentFactory={makeUserItemFactory("/followees")}
            />
          }
        />
        <Route
          path="followers/:displayedUser"
          element={
            <ItemScroller<User>
              key={`followers=${displayedUser!.alias}`}
              presenterFactory={(view: PagedItemView<User>) =>
                new FollowerPresenter(view)
              }
              featureUrl="/followers"
              itemComponentFactory={makeUserItemFactory("/followers")}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route
          path="*"
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
