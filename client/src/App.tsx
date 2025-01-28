import Login from "./pages/Login"
import { Navigate, Route, Routes } from "react-router-dom"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Layout from "./components/Layout"
function App() {
  return (
    <>
      <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>

      </div>
    </>
  )
}

export default App
