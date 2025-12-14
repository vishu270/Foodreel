import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";


function App() {
  return (
    <Router>
      <main className="content" style={{ padding: "1px" }} >
        <AppRoutes />
      </main>
    </Router>
  );
}

export default App;
