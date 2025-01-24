import { updateProfile } from "firebase/auth";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { IoArrowBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { AuthContextAPI } from "../../context/AuthContext";

const UploadProfilePhoto = () => {
  let navigate = useNavigate();
  const [file, setFile] = useState();
  const [preview, setPreview] = useState(null);
  let [isLoading, setIsLoading] = useState(false);

  let { authUser } = useContext(AuthContextAPI);

  const handleFileChange = e => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = e => {
        setPreview(e.target.result);
      };
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!file) {
        toast.error("Please select a file before uploading.");
        return;
      }

      const data = new FormData();
      data.append("file", file); // Use "file" as the key for the actual file
      data.append("upload_preset", "live-music"); // Replace with your upload preset
      data.append("cloud_name", "de19mc5cy");

      // Make the request to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/de19mc5cy/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();
      const imageUrl = result.url;

      await updateProfile(authUser, {
        photoURL: imageUrl,
      });
      navigate("/user/profile");
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <article className="min-[100%-70px] bg-gray-850 flex flex-col justify-center py-12">
        <header>
          <h1 className="mt-10 text-center text-3xl leading-5 text-purple-600 max-w">
            Upload profile photo
          </h1>
        </header>
        <main className="mt-8 m-auto">
          <form
            className="w-[400px] flex flex-col justify-center bg-gray-700 p-4 rounded-xl border-b-2 border-b-purple-700"
            onSubmit={handleSubmit}
          >
            <div className="p-2">
              <label
                htmlFor="file"
                className="flex items-center justify-between font-medium text-gray-100 leading-5 py-2 text-lg mb-4"
              >
                <span>Profile photo</span>
                <span className="text-xl py-1 px-3 bg-purple-700 rounded-lg">
                  <Link to="/user/profile">
                    <IoArrowBack />
                  </Link>
                </span>
              </label>

              {preview ? (
                <div className="mb-4">
                  <img
                    src={preview}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover rounded-full mx-auto border-2 border-purple-500 shadow-md"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <div className="w-32 h-32 bg-gray-500 rounded-full mx-auto flex items-center justify-center text-gray-100">
                    No file selected
                  </div>
                </div>
              )}

              <label
                htmlFor="file"
                className="block w-full cursor-pointer text-center py-2 px-4 border border-dashed border-gray-500 rounded-md text-gray-400 hover:bg-gray-600 focus:outline-none"
              >
                {file ? file.name : "Choose a file"}
              </label>
              <input
                type="file"
                id="file"
                name="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="p-2">
              <button
                type="submit"
                className="bg-[#eb6378] w-full flex justify-center py-2 px-4 border-transparent text-md font-medium my-1 rounded-md text-white hover:bg-purple-600 focus:outline-none"
              >
                {isLoading ? "...Loading" : "Upload photo"}
              </button>
            </div>
          </form>
        </main>
      </article>
    </section>
  );
};

export default UploadProfilePhoto;
