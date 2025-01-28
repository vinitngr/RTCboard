import Login from "./pages/Login"
import { Navigate, Route, Routes } from "react-router-dom"
import Register from "./pages/Register"
import Home from "./pages/Home"
import { useEffect, useState } from "react"
import { useAuthStore } from "./store/authStore"
import Navbar from "./components/Navbar"
import { Loader } from "lucide-react"
import Profile from "./pages/Profile"
function App() {
  const [isloading , setisloading] = useState(true) 
  const { checkAuth , authUser } = useAuthStore()

  useEffect(() => {
    const checkAuthStatus = async () => {
      await checkAuth();
      setisloading(false);
    };
  
    checkAuthStatus();
  }, [checkAuth]);
  
  return (
    <>
    <Navbar/>

    {isloading ? 
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div> : 
      <Routes>
        <Route path="/home" element={authUser ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={!authUser ? <Login/> : <Navigate to="/home" replace /> } />
        <Route path="/register" element={!authUser ? <Register /> : <Navigate to="/home" replace />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={authUser ? "/home" : "/login"} replace />} />
      </Routes>
    }
    </>
  )
}

export default App
