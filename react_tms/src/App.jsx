import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Signup from "./Components/Signup";
import { Route, Routes } from "react-router-dom";
import Button from "./Components/Button";
import Techform from "./Pages/Techform";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tech" element={<Techform />} />
    </Routes>
    // <Button />
  );
}

export default App;
