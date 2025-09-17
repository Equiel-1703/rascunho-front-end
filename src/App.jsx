import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header.jsx";
import Home from "./components/Home/Home.jsx";
import Login from "./components/Login/Login.jsx";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Home page */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Login page */}
        <Route
          path="/login"
          element={<Login />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
