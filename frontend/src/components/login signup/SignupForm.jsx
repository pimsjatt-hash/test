// import React, { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import { useNavigate } from "react-router-dom"; // ✅ import navigate

// export default function Signup({ role }) {
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [isOtpVerified, setIsOtpVerified] = useState(false);
//   const [doc, setDoc] = useState(null);

//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     universityCode: "",
//     referralCode: ""
//   });

//   const API_BASE = "http://localhost:5000/api/auth";
//   const navigate = useNavigate(); // ✅ hook for redirection

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Send OTP
//   const handleSendOtp = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/send-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone: form.phone }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setOtpSent(true);
//         alert(`OTP sent ✅ (devOtp: ${data.devOtp})`);
//       } else {
//         alert(data.message || "Failed to send OTP");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error sending OTP");
//     }
//   };

//   // Verify OTP
//   const handleVerifyOtp = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/verify-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone: form.phone, code: otp }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setIsOtpVerified(true);
//         alert("OTP Verified ✅");
//       } else {
//         alert(data.message || "OTP verification failed");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error verifying OTP");
//     }
//   };

//   // Signup
//   const handleSignup = async () => {
//     if (!isOtpVerified) {
//       alert("Please verify OTP first");
//       return;
//     }
//     if (form.password !== form.confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     try {
//       let res, data;

      
//         res = await fetch(`${API_BASE}/register`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ ...form, role }),
//         });
      
//       data = await res.json();
//       if (res.ok) {
//         alert(`Account created ✅\nWelcome ${data.user.fullName}`);
//         localStorage.setItem("token", data.token);

//         // ✅ Redirect to login after success
//         navigate("/login"); 
//       } else {
//         alert(data.message || "Signup failed");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error creating account");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center">
//       <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
//         <h2 className="text-2xl font-bold mb-2">Create Account</h2>
//         <p className="text-gray-500 mb-6">Continue as {role}</p>

//         {/* Full Name */}
//         <input
//           name="fullName"
//           type="text"
//           placeholder="Full Name"
//           value={form.fullName}
//           onChange={handleChange}
//           className="w-full border rounded-lg p-2 mb-3"
//         />

//         {/* Email */}
//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           className="w-full border rounded-lg p-2 mb-3"
//         />

//         {/* Phone + OTP */}
//         <div className="mb-3">
//           <div className="flex gap-2">
//             <input
//               name="phone"
//               type="tel"
//               placeholder="Phone"
//               value={form.phone}
//               onChange={handleChange}
//               className="flex-1 border rounded-lg p-2"
//             />
//             {!otpSent ? (
//               <button onClick={handleSendOtp} className="bg-blue-500 text-white px-4 rounded-lg">
//                 Send OTP
//               </button>
//             ) : (
//               <button onClick={handleVerifyOtp} className="bg-green-500 text-white px-4 rounded-lg">
//                 Verify OTP
//               </button>
//             )}
//           </div>
//           {otpSent && (
//             <input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full border rounded-lg p-2 mt-2"
//             />
//           )}
//         </div>

//         {/* Password */}
//         <div className="relative mb-3">
//           <input
//             name="password"
//             type={passwordVisible ? "text" : "password"}
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-2 pr-10"
//           />
//           <button
//             type="button"
//             onClick={() => setPasswordVisible(!passwordVisible)}
//             className="absolute right-3 top-2"
//           >
//             {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         </div>

//         {/* Confirm Password */}
//         <input
//           name="confirmPassword"
//           type="password"
//           placeholder="Confirm Password"
//           value={form.confirmPassword}
//           onChange={handleChange}
//           className="w-full border rounded-lg p-2 mb-3"
//         />

//         {/* Role specific */}
//         {role === "Teacher" && (
//           <input
//             name="universityCode"
//             placeholder="University Code"
//             value={form.universityCode}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-2 mb-3"
//           />
//         )}
//         {role === "University" && (
//           <div className="mb-3">
//             <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" onChange={(e) => setDoc(e.target.files[0])} />
//           </div>
//         )}
     
//         {role === "Referral" && (
//           <input
//             name="referralCode"
//             placeholder="Referral Code"
//             value={form.referralCode}
//             onChange={handleChange}
//             className="w-full border rounded-lg p-2 mb-3"
//           />
//         )}

//         <button onClick={handleSignup} className="w-full bg-green-600 text-white rounded-lg p-2 font-medium">
//           Create Account
//         </button>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../api/api"; // import your API helper

export default function Signup({ role }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    universityCode: "",
    referralCode: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Prepare payload for backend
      const payload = {
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        roles: [role.toLowerCase()], // backend expects array
        universityCode: form.universityCode || undefined,
        referralCode: form.referralCode || undefined
      };

      console.log(payload,"my");
      
      const { data } = await signup(payload);

      alert(`Account created ✅\n${data.message}`);
      localStorage.setItem("token", data.token || "");
      navigate("/login"); // redirect to login
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-2">Create Account</h2>
        <p className="text-gray-500 mb-6">Continue as {role}</p>

        {/* Full Name */}
        <input
          name="fullName"
          type="text"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-3"
        />

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-3"
        />

        {/* Phone */}
        <input
          name="phone"
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-3"
        />

        {/* Password */}
        <div className="relative mb-3">
          <input
            name="password"
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 pr-10"
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-3 top-2"
          >
            {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-3"
        />

        {/* Role specific fields */}
        {role.toLowerCase() === "teacher" && (
          <input
            name="universityCode"
            placeholder="University Code"
            value={form.universityCode}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mb-3"
          />
        )}

        {role.toLowerCase() === "referral" && (
          <input
            name="referralCode"
            placeholder="Referral Code"
            value={form.referralCode}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mb-3"
          />
        )}

        <button
          onClick={handleSignup}
          className="w-full bg-green-600 text-white rounded-lg p-2 font-medium"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
