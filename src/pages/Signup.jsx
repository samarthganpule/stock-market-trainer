import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";



function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

const handleSignup = async (e) => {
  e.preventDefault();
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    navigate("/dashboard"); // ✅ redirect
  } catch (error) {
    setMessage("❌ " + error.message);
  }
};

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h2 className="text-3xl font-bold mb-6">Create an account</h2>
      <form onSubmit={handleSignup} className="bg-gray-800 p-6 rounded w-full max-w-sm shadow">
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 bg-gray-700 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 bg-gray-700 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded">
          Sign Up
        </button>
        {message && <p className="text-sm mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
}

export default Signup;
