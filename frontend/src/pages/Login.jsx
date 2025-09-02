// // import React, { useState } from "react";
// // import { Eye, EyeOff } from "lucide-react";

// // export default function Login() {
// //   const [loginMode, setLoginMode] = useState("email"); // email | phone
// //   const [passwordVisible, setPasswordVisible] = useState(false);

// //   // form states
// //   const [email, setEmail] = useState("");
// //   const [phone, setPhone] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const handleLogin = async () => {
// //     try {
// //       setLoading(true);

// //       const body = {
// //         emailOrPhone: loginMode === "email" ? email : phone,
// //         password,
// //       };

// //       const res = await fetch("http://localhost:5000/api/auth/login", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(body),
// //       });

// //       const data = await res.json();
// //       if (!res.ok) {
// //         alert(data.message || "Login failed ❌");
// //         return;
// //       }

// //       // store token + user
// //       localStorage.setItem("token", data.token);
// //       localStorage.setItem("user", JSON.stringify(data.user));

// //       alert("✅ Logged in successfully");
// //       window.location.href = "/"; // redirect
// //     } catch (err) {
// //       console.error(err);
// //       alert("Something went wrong ❌");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
// //       <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
// //         <h2 className="text-2xl font-bold mb-2">Login</h2>
// //         <p className="text-gray-500 mb-6">
// //           {loginMode === "email"
// //             ? "Sign in with Email & Password"
// //             : "Sign in with Phone & Password"}
// //         </p>

// //         {/* Toggle Login Mode */}
// //         <div className="flex justify-center mb-6 gap-3">
// //           <button
// //             onClick={() => setLoginMode("email")}
// //             className={`px-4 py-2 rounded-l-lg ${
// //               loginMode === "email"
// //                 ? "bg-green-600 text-white"
// //                 : "bg-gray-200 text-gray-600"
// //             }`}
// //           >
// //             Email
// //           </button>
// //           <button
// //             onClick={() => setLoginMode("phone")}
// //             className={`px-4 py-2 rounded-r-lg ${
// //               loginMode === "phone"
// //                 ? "bg-green-600 text-white"
// //                 : "bg-gray-200 text-gray-600"
// //             }`}
// //           >
// //             Phone
// //           </button>
// //         </div>

// //         {loginMode === "email" && (
// //           <>
// //             {/* Email */}
// //             <div className="mb-4">
// //               <label className="block mb-1 text-sm">Email</label>
// //               <input
// //                 type="email"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 placeholder="Enter your email"
// //                 className="w-full border rounded-lg p-2"
// //               />
// //             </div>
// //           </>
// //         )}

// //         {loginMode === "phone" && (
// //           <>
// //             {/* Phone */}
// //             <div className="mb-4">
// //               <label className="block mb-1 text-sm">Phone Number</label>
// //               <input
// //                 type="tel"
// //                 value={phone}
// //                 onChange={(e) => setPhone(e.target.value)}
// //                 placeholder="Enter your phone number"
// //                 className="w-full border rounded-lg p-2"
// //               />
// //             </div>
// //           </>
// //         )}

// //         {/* Password */}
// //         <div className="mb-6 relative">
// //           <label className="block mb-1 text-sm">Password</label>
// //           <input
// //             type={passwordVisible ? "text" : "password"}
// //             value={password}
// //             onChange={(e) => setPassword(e.target.value)}
// //             placeholder="Enter your password"
// //             className="w-full border rounded-lg p-2 pr-10"
// //           />
// //           <button
// //             type="button"
// //             className="absolute right-3 top-8 text-gray-500 bg-white px-1 py-0.5"
// //             onClick={() => setPasswordVisible(!passwordVisible)}
// //           >
// //             {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
// //           </button>
// //         </div>

// //         <button
// //           onClick={handleLogin}
// //           disabled={loading}
// //           className="w-full bg-green-600 text-white rounded-lg p-2 font-medium"
// //         >
// //           {loading ? "Logging in..." : "Login"}
// //         </button>

// //         {/* Footer */}
// //         <p className="text-center text-sm mt-4">
// //           Don’t have an account?{" "}
// //           <a href="/signup" className="text-green-600 font-semibold">
// //             Sign up
// //           </a>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }
// import React, { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import { login } from "../api/api"; // ✅ import login API

// export default function Login() {
//   const [loginMode, setLoginMode] = useState("email");
//   const [passwordVisible, setPasswordVisible] = useState(false);

//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     try {
//       setLoading(true);

//       const body = {
//         emailOrPhone: loginMode === "email" ? email : phone,
//         password,
//       };

//       console.log(body, "here");
      
//       const { data } = await login(body); // ✅ use API

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       alert("✅ Logged in successfully");
//       window.location.href = "/";
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Login failed ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
//         <h2 className="text-2xl font-bold mb-2">Login</h2>
//         <p className="text-gray-500 mb-6">
//           {loginMode === "email"
//             ? "Sign in with Email & Password"
//             : "Sign in with Phone & Password"}
//         </p>

//         {/* Toggle */}
//         <div className="flex justify-center mb-6 gap-3">
//           <button
//             onClick={() => setLoginMode("email")}
//             className={`px-4 py-2 rounded-l-lg ${
//               loginMode === "email"
//                 ? "bg-green-600 text-white"
//                 : "bg-gray-200 text-gray-600"
//             }`}
//           >
//             Email
//           </button>
//           <button
//             onClick={() => setLoginMode("phone")}
//             className={`px-4 py-2 rounded-r-lg ${
//               loginMode === "phone"
//                 ? "bg-green-600 text-white"
//                 : "bg-gray-200 text-gray-600"
//             }`}
//           >
//             Phone
//           </button>
//         </div>

//         {loginMode === "email" && (
//           <div className="mb-4">
//             <label className="block mb-1 text-sm">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               className="w-full border rounded-lg p-2"
//             />
//           </div>
//         )}

//         {loginMode === "phone" && (
//           <div className="mb-4">
//             <label className="block mb-1 text-sm">Phone</label>
//             <input
//               type="tel"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               placeholder="Enter your phone number"
//               className="w-full border rounded-lg p-2"
//             />
//           </div>
//         )}

//         <div className="mb-6 relative">
//           <label className="block mb-1 text-sm">Password</label>
//           <input
//             type={passwordVisible ? "text" : "password"}
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter your password"
//             className="w-full border rounded-lg p-2 pr-10"
//           />
//           <button
//             type="button"
//             className="absolute right-3 top-8 text-gray-500"
//             onClick={() => setPasswordVisible(!passwordVisible)}
//           >
//             {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         </div>

//         <button
//           onClick={handleLogin}
//           disabled={loading}
//           className="w-full bg-green-600 text-white rounded-lg p-2 font-medium"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         <p className="text-center text-sm mt-4">
//           Don’t have an account?{" "}
//           <a href="/signup" className="text-green-600 font-semibold">
//             Sign up
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const body = { email, password };

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Login failed ❌");
        return;
      }

      // store token + user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("✅ Logged in successfully");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-2">Login</h2>
        <p className="text-gray-500 mb-6">Sign in with Email & Password</p>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <label className="block mb-1 text-sm">Password</label>
          <input
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border rounded-lg p-2 pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-8 text-gray-500 bg-white px-1 py-0.5"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-green-600 text-white rounded-lg p-2 font-medium"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-green-600 font-semibold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
