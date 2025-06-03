"use client";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";

export default function Signup() {
  // Variable
  const [formData, setFormData]: [
    formData: {
      username_email: string;
      password: string;
    },
    setFormData: Dispatch<
      SetStateAction<{
        username_email: string;
        password: string;
      }>
    >
  ] = useState({
    username_email: "",
    password: "",
  });
  const [error, setError] = useState("");

  // Handle submit
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const submitData = {
      username_email: formData.username_email,
      password: formData.password,
    };

    const response: Response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/jason",
      },
      body: JSON.stringify(submitData),
    });

    const responseData = await response.json();

    setError(responseData.error);
  }

  return (
    <div className="p-5 flex flex-col w-min">
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        {/* Username */}
        <input
          name="username_email"
          type="text"
          placeholder="Username or email"
          onChange={(e) =>
            setFormData({ ...formData, username_email: e.target.value })
          }
          className="border-2 border-white py-1 px-2 rounded-full"
          value={formData.username_email}
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

        {/* Error message */}
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}
