"use client";

import { useState } from "react";
import { authClient } from "../../lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState(""); // ✅ اسم الـ state يجب أن يكون username
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const router = useRouter();

  const handleLogin = async () => {await console.log("handle login");
  //  try {
  //    const res = await authClient.signIn.username({ 
  //      username, password }); 
//
  //    if (res.data?.user) {
  //      const u = res.data.user;
  //      setUser({ username: u.username!, role: u.role! }); // ✅ استخدام username من user
//
  //      // إعادة توجيه حسب الدور
  //      if (u.role === "admin") router.push("/admin");
  //      else router.push("/user");
  //    }
  //  } catch (err) {
  //    console.error("Login failed:", err);
  //  }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2">
        Login
      </button>

      {user && (
        <p>
          Logged in as {user.username} ({user.role})
        </p>
      )}
    </div>
  );
}
