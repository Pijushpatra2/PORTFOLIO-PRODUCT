import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import ResetPassword from "./pages/ResetPassword";
import ManageSkills from "./pages/ManageSkills";
import ManageTimeline from "./pages/ManageTimeline";
import ViewProject from "./pages/ViewProject";
import UpdateProject from "./pages/UpdateProject";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Loader from "./components/Loader";
import HomePage from "./pages/HomePage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { getUser } from "./store/slices/userSlice.js";
import { getAllMessages } from "./store/slices/messagesSlice";
import { getAllTimeline } from "./store/slices/timelineSlice";
import { getAllSkills } from "./store/slices/skillSlice";
import { getAllSoftwareApplications } from "./store/slices/softwareApplicationSlice";
import { getAllProjects } from "./store/slices/projectSlice";
import ManageProjects from "./pages/ManageProjects";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
    dispatch(getAllSkills());
    dispatch(getAllSoftwareApplications());
    dispatch(getAllTimeline());
    dispatch(getAllMessages());
    dispatch(getAllProjects());
  }, []);

  return (
    <>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset/:token" element={<ResetPassword />} />
            <Route path="/manage/skills" element={<ManageSkills />} />
            <Route path="/manage/timeline" element={<ManageTimeline />} />
            <Route path="/manage/timeline" element={<ManageTimeline />} />
            <Route path="/manage/projects" element={<ManageProjects />} />
            <Route path="/view/project/:id" element={<ViewProject />} />
            <Route path="/update/project/:id" element={<UpdateProject />} />
          </Routes>
        </Suspense>
      </Router>
      <ToastContainer />
    </>
  );
};

export default App;
