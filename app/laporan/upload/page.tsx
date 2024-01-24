"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import NavBar from "../../components/NavBar";
import { navigateLaporan } from "../actions";

export default function UploadReport() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    title: { message: string };
    description: { message: string };
    file: { message: string };
  }>();
  const [uploading, setUploading] = useState(false);

  const onSubmit = async (data: any) => {
    // Display loading indicator while uploading
    setUploading(true);

    // Create FormData object for multipart form data
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("file", data.file[0]);

    try {
      // Make API call to POST /reports/
      const response = await fetch("/api/reports", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Redirect to the homepage if the report is successfully uploaded
        navigateLaporan();
      } else {
        // Handle error
        alert("Error uploading report. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading report:", error);
      alert("Error uploading report. Please try again.");
    } finally {
      // Reset loading indicator after the API call is complete
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-stretch h-screen">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-center">Unggah Laporan</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
          <div className="flex flex-col">
            <label className="block mb-2">Title:</label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            {/* Display error message if title is not provided */}
            {errors.title && (
              <span className="text-red-500">
                {errors.title.message?.toString()}
              </span>
            )}

            <label className="block mb-2">Description:</label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            {/* Display error message if description is not provided */}
            {errors.description && (
              <span className="text-red-500">
                {errors.description.message?.toString()}
              </span>
            )}

            <label className="block mb-2">PDF File:</label>
            <input
              type="file"
              {...register("file", { required: "PDF file is required" })}
              className="mb-4"
            />
            {/* Display error message if PDF file is not provided */}
            {errors.file && (
              <span className="text-red-500">
                {errors.file.message?.toString()}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="bg-green-700 text-white py-2 px-4 rounded"
            disabled={uploading}
          >
            {uploading ? "Mengunggah..." : "Unggah Laporan"}
          </button>
        </form>
      </main>
    </div>
  );
}
