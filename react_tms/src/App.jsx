import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import { Route, Routes } from "react-router-dom";
import { RoleProvider } from "./Components/customHooks/RoleContext";
function App() {
  return (
    <RoleProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </RoleProvider>
  );
}

export default App;
