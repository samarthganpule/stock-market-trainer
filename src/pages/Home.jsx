function Home() {
  return (
     
    
       <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-center flex items-center gap-2">
        <img src="https://cdn-icons-png.flaticon.com/512/3239/3239956.png" alt="Logo" className="w-10 h-10" />
        MyStockTrainer
      </h1>
      <p className="text-lg text-gray-300 mt-4 text-center">
        Learn & Monitor the Stock Market — Risk Free.
      </p>
      <div className="mt-8 flex gap-4">
        <Link to="/login" className="bg-black px-6 py-2 rounded-md hover:bg-gray-800 transition">
          Login
        </Link>
        <Link to="/signup" className="border px-6 py-2 rounded-md hover:bg-gray-700 transition">
          Sign Up
        </Link>
      </div>
    </div>
   
  );
}

export default Home;
