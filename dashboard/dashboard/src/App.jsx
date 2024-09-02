import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" />
        <Route path="/login" />
        <Route path="/password/forgot" />
        <Route path="/password/reset/:token" />
        <Route path="/manage/skill" />
        <Route path="/manage/timeline" />
        <Route path="/manage/projects" />
        <Route path="/view/project/:id" />
      </Routes>
    </Router>
  );
};

export default App;
