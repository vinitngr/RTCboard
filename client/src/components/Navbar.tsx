import { useAuthStore } from "../store/authStore";

function Navbar() {
  
  const {handleLogout , authUser } = useAuthStore()
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">MyApp</div>
      <ul className="flex space-x-4">
        <li className="hover:underline cursor-pointer">Home</li>
        <li className="hover:underline cursor-pointer">About</li>
        <li className="hover:underline cursor-pointer"
        onClick={() => ( authUser && handleLogout()) }
        >LogOut</li>
      </ul>
    </nav>
  );
}

export default Navbar;
