import { Route, Routes } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import StartupPage from "./components/StartupPage/StartupPage";
import EditProfile from "./components/MainPage/EditProfile/EditProfile";
import UserPage from "./components/MainPage/SidebarRight/Profile/UserPage";


function App() {
  return (
      <div className="App">
        <Routes>
          <Route path="/" element={<StartupPage />} />
          <Route path="/mainPage" element={<MainPage />} />
          <Route path="/mainPage/editProfile" element={<EditProfile />} />
          <Route path="/mainPage/profile/:userId" element={<UserPage />} />
        </Routes>
      </div>
  );
}

export default App;
