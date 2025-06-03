"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [showUsername, setShowUsername] = useState("");
  const [loggedout, setLoggedout] = useState("");

  async function gettingUserData() {
    const response = await fetch("/api/verify", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const userData = await response.json();
      setShowUsername(userData.username);
    } else {
      router.push("/login");
    }
  }

  async function logoutUser() {
    const response = await fetch("/api/logout", {
      method: "GET",
    });

    if(response.ok){
      setLoggedout("Sucess");
    }
  }
  return (
    <div className="flex flex-col gap-2 p-5 w-min">
      <a href="/login" className="border-2 border-white py-1 px-2 rounded-full">
        Login
      </a>
      <a
        href="/signup"
        className="border-2 border-white py-1 px-2 rounded-full"
      >
        Signup
      </a>

      <br />
      <br />
      <br />

      <button onClick={logoutUser} className="cursor-pointer">
        Logout
      </button>
      {loggedout && <p>{loggedout}</p>}

      <br />
      <br />
      <br />

      <button onClick={gettingUserData} className="cursor-pointer ">
        Show_details
      </button>
      {showUsername && <p>{showUsername}</p>}
    </div>
  );
}
