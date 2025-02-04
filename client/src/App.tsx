import Login from "./pages/Login"
import { Navigate, Route, Routes } from "react-router-dom"
import Register from "./pages/Register"
import Home from "./pages/Home"
import { useEffect, useState } from "react"
import { useAuthStore } from "./store/authStore"
import { Loader } from "lucide-react"
import Profile from "./pages/Profile"
import Room from "./pages/Room"
import Layout from "./components/Layout"
import { useRoomStore } from "./store/roomStore"
import Meetings from "./pages/Meething"
function App() {
  const [isloading , setisloading] = useState(true) 
  const { checkAuth , authUser } = useAuthStore()
  const { roomDetails } = useRoomStore()
  useEffect(() => {
    const checkAuthStatus = async () => {
      await checkAuth();
      setisloading(false);
    };
  
    checkAuthStatus();
  }, [checkAuth]);
  
  return (
    <>
    {isloading ? 
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div> : 
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={authUser ? <Home /> : <Navigate to="/login" replace />} />
          <Route path="home" element={authUser ? (roomDetails ? <Navigate to={`/room/${roomDetails?.roomId}`} replace /> : <Home />) : <Navigate to="/login" replace />} />
          <Route path="login" element={!authUser ? <Login /> : <Navigate to="/home" replace /> } />
          <Route path="register" element={!authUser ? <Register /> : <Navigate to="/home" replace />} />
          <Route path="profile" element={authUser ? (roomDetails ? <Navigate to={`/room/${roomDetails?.roomId}`} replace /> :<Profile />) : <Navigate to="/login" replace />} />
          <Route path="meetings" element={authUser ? (roomDetails ? <Navigate to={`/room/${roomDetails?.roomId}`} replace /> :<Meetings />) : <Navigate to="/login" replace />} />
        </Route>
        <Route path="/room/:roomId" element={(authUser && roomDetails ) ? <Room /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={authUser ? "/home" : "/login"} replace />} />
      </Routes>
    }
    </>
  )
}

export default App
