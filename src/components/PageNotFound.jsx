import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 px-4 text-center">
      <h1 className="text-9xl font-extrabold text-gray-900 drop-shadow-lg">
        404
      </h1>
      <p className="text-xl md:text-2xl text-gray-700 mt-4 font-semibold">
        Oops! The page you're looking for doesn't exist.
      </p>
      <img
        src="https://source.unsplash.com/500x300/?error,404"
        alt="Not Found"
        className="w-full max-w-md my-6 rounded-lg shadow-xl border-4 border-white"
      />
      <Link
        to="/"
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transform transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
}
