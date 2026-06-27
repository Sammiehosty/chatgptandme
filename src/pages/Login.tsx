import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
const { setUser } = useAuth();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);

const submit = async () => {
setLoading(true);
setMessage("");


try {
  const response = await fetch(`https://vcc.sammiehosty.com/api/login.php`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (data.success) {
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    setUser(data.user);

window.dispatchEvent(
  new CustomEvent('login-success')
);

setMessage("Login successful");
  } else {
    setMessage(data.message || "Login failed");
  }
} catch (error) {
  console.error(error);
  setMessage("Unable to login");
}

setLoading(false);


};

return ( <div className="w-full max-w-md mx-auto"> <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">


    <div className="text-center mb-8">
      <img
        src="https://vcc.sammiehosty.com/logo.jpg"
        alt="Logo"
        className="w-20 h-20 mx-auto rounded-3xl object-cover mb-4"
      />

      <h1 className="text-3xl font-bold text-white">
        Welcome Back
      </h1>

      <p className="text-slate-400 mt-2">
        Login to continue listening to sermons
      </p>
    </div>

    {message && (
      <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
        {message}
      </div>
    )}

    <input
      type="email"
      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 mb-3 text-white"
      placeholder="Email Address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      type="password"
      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 mb-4 text-white"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button
      onClick={submit}
      disabled={loading}
      className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold p-3 rounded-xl"
    >
      {loading ? "Signing In..." : "Login"}
    </button>
  </div>
</div>


);
}
