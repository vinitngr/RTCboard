import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";


function Navbar() {
  const navigate = useNavigate();
  const { handleLogout, authUser } = useAuthStore();
  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold hover:cursor-pointer"
      onClick={() => navigate("/home")}
      >RTCboard</div>
      <ul className="flex space-x-4">
        <li className="hover:underline cursor-pointer"
        onClick={() => navigate("/home")}
        >Home</li>
        
        {authUser && (
          <>
            <li className="hover:underline cursor-pointer"
            onClick={() => navigate("/profile")}>
              Profile</li>
            <li className="hover:underline cursor-pointer" onClick={handleLogout}>
              LogOut
          </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
