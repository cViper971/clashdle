import { Routes, Route } from "react-router-dom";
import Game from "./Game";
import Login from "./Login";
import Register from "./Register";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/game" element={<Game />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
