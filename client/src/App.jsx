import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Attractions from "./pages/Attractions";
import AttractionDetails from "./pages/AttractionDetails";
import ActivityDetails from "./pages/ActivityDetails";
import Booking from "./pages/Booking";
import ErrorPage from "./pages/ErrorPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HomeButton from "./components/HomeButton";

function App() {
  return (
    <>
      <HomeButton />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/attractions" element={<Attractions />} />
        <Route path="/attractions/:id" element={<AttractionDetails />} />
        <Route path="/activities/:id" element={<ActivityDetails />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;