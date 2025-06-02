export default function Home() {
  return (
    <div className="flex gap-2 p-5 w-min">
      <a href="/login" className="border-2 border-white py-1 px-2 rounded-full">
        Login
      </a>
      <a
        href="/signup"
        className="border-2 border-white py-1 px-2 rounded-full"
      >
        Signup
      </a>
    </div>
  );
}
