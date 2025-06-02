"use client";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";

export default function Signup() {
  // Variables
  const [formData, setFormData]: [
    formData: {
      username: string;
      email: string;
      password: string;
    },
    setFormData: Dispatch<
      SetStateAction<{
        username: string;
        email: string;
        password: string;
      }>
    >
  ] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle submit
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Variable
    const submitFormData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    // Posting data and fetching response
    const response: Response = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(submitFormData),
    });
    const responseData = await response.json();

    // Checking response and showing message based on it
    if (response.ok) {
      setSuccessMessage(responseData.success);
      setError("");
    } else {
      setSuccessMessage("");
      setError(responseData.error);
    }
  }

  return (
    <div className="p-5 flex flex-col w-min">
      <form className="flex flex-col gap-2 mb-4" onSubmit={handleSubmit}>
        {/* Username */}
        <input
          name="username"
          type="text"
          placeholder="Username"
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className="border-2 border-white py-1 px-2 rounded-full"
          value={formData.username}
        />

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border-2 border-white py-1 px-2 rounded-full"
          value={formData.email}
        />

        {/* Password */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="border-2 border-white py-1 px-2 rounded-full"
          value={formData.password}
        />

        {/* Submit */}
        <button
          type="submit"
          className="border-2 border-white py-1 px-2 rounded-full cursor-pointer"
        >
          Submit
        </button>
      </form>

      {/* Error message */}
      {error && <p className="text-red-600">{error}</p>}
      {/* Success messag */}
      {successMessage && <p className="text-green-600">{successMessage}</p>}
    </div>
  );
}
