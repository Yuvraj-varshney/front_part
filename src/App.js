import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from "./components/Home";
import Register from "./components/Register";
 import Login from "./components/Login";



function App() {
 return (
  <BrowserRouter>
 <Routes>
  <Route exact path="/" element={<Home />} />

  <Route path="/login" element={<Home />} />

  <Route path="/register" element={<Home />} />
 </Routes>
 </BrowserRouter>
 );
}

export default App;
