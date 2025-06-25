function Signup() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h2 className="text-3xl font-bold mb-6">Create an account</h2>
      <form className="bg-gray-800 p-6 rounded-lg w-full max-w-sm shadow">
        <input
          type="text"
          placeholder="Name"
          className="w-full mb-4 p-2 bg-gray-700 rounded outline-none"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 bg-gray-700 rounded outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-2 bg-gray-700 rounded outline-none"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
