import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthContext from "./components/AuthContext/AuthContext.jsx";

import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Home from "./components/Home/Home.jsx";
import Login from "./components/Login/Login.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthContext>
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
        <Footer />
      </AuthContext>
    </BrowserRouter>
  );
}

export default App;
