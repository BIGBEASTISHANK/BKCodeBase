"use client";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";

export default function Signup() {
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const submitData: FormData = new FormData();
    submitData.append("username_email", formData.username_email);
    submitData.append("password", formData.password);

    const response: Response = await fetch("/api/login", {
      method: "POST",
      body: submitData,
    });
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
        \{/* Password */}
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
    </div>
  );
}
