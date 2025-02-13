import { FormEvent, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom"; // Import Link for navigation
import { Eye, EyeOff } from "lucide-react";

function Register() {
  const [isVisible, setisVisible] = useState(false)
  const [formData, setFormData] = useState<{ email: string; fullName: string; password: string , profession: string }>({
    email: "",
    fullName: "",
    password: "",
    profession: "",
  });
  const { handleRegister } = useAuthStore();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleRegister(formData);
  };

  return (
    <div className="h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter your Name"
              name="fullName"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Enter your Email"
              name="email"
              value={formData.email}
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <select
              name="profession"
              required
              value={formData.profession}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black 
                ${!formData.profession ? "text-gray-400" : "text-black"}`}
            >
              <option value="" disabled hidden>
                Select your profession
              </option>
              <option value="Student">Student</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Product Manager">Product Manager</option>
              <option value="UX Designer">UX Designer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Cyber Security Engineer">Cyber Security Engineer</option>
              <option value="Artificial Intelligence Engineer">
                Artificial Intelligence Engineer
              </option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="relative">
            <input
              type={isVisible ? "text" : "password"}
              placeholder="Enter your Password"
              name="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setisVisible(!isVisible)}
            >
              {isVisible ? <Eye/> : <EyeOff/>}
              
            </button>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              Register
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="text-black hover:underline"
          >
            Already have an account? Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
