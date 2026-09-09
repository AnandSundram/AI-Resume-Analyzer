import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeUpload from "./pages/ResumeUpload";
import JobDescription from "./pages/JobDescription";
import Analyze from "./pages/Analyze";
import Results from "./pages/Results";
import History from "./pages/History";
import AnalysisDetail from "./pages/AnalysisDetail";

import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./components/ProtectedLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* Protected */}

        <Route element={<ProtectedRoute />}>

          <Route element={<ProtectedLayout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/upload-resume"
              element={<ResumeUpload />}
            />

            <Route
              path="/add-job"
              element={<JobDescription />}
            />

            <Route
              path="/analyze"
              element={<Analyze />}
            />

            <Route
              path="/results"
              element={<Results />}
            />

            <Route
              path="/history"
              element={<History />}
            />

            <Route
              path="/analysis/:id"
              element={<AnalysisDetail />}
            />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;