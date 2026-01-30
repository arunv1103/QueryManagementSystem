// import React, { useEffect, useRef, useState } from "react";
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import { auth } from "../firebase/firebase-config"; // ✅ Correct import

// const PhoneAuth = () => {
//   const [mobile, setMobile] = useState("");
//   const [otp, setOtp] = useState("");
//   const [confirmObj, setConfirmObj] = useState(null);
//   const recaptchaInitialized = useRef(false);

//   useEffect(() => {
//     if (
//       !recaptchaInitialized.current &&
//       typeof window !== "undefined" &&
//       auth
//     ) {
//       try {
//         // Optional: Only for testing
//         if (auth.settings) {
//           auth.settings.appVerificationDisabledForTesting = true;
//         }

//         window.recaptchaVerifier = new RecaptchaVerifier(
//           auth,
//           "recaptcha-container",
//           {
//             size: "invisible",
//             callback: (response) => {
//               console.log("✅ reCAPTCHA verified:", response);
//             },
//             "expired-callback": () => {
//               console.warn("reCAPTCHA expired.");
//             },
//           }
//         );

//         window.recaptchaVerifier.render().then((widgetId) => {
//           window.recaptchaWidgetId = widgetId;
//           recaptchaInitialized.current = true;
//         });
//       } catch (error) {
//         console.error("❌ reCAPTCHA init error:", error);
//       }
//     }
//   }, []);

//   const sendOtp = async () => {
//     const phoneNumber = "+91" + mobile.trim();
//     if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
//       alert("Enter a valid 10-digit Indian mobile number.");
//       return;
//     }

//     const appVerifier = window.recaptchaVerifier;

//     if (!appVerifier) {
//       alert("reCAPTCHA not ready. Please try again.");
//       return;
//     }

//     try {
//       const confirmationResult = await signInWithPhoneNumber(
//         auth,
//         phoneNumber,
//         appVerifier
//       );
//       setConfirmObj(confirmationResult);
//       alert("✅ OTP Sent!");
//     } catch (error) {
//       console.error("OTP sending failed:", error);
//       alert(error.message || "Failed to send OTP");
//     }
//   };

//   const verifyOtp = async () => {
//     if (!confirmObj) {
//       alert("Request OTP first.");
//       return;
//     }

//     if (!otp.trim()) {
//       alert("Enter the OTP.");
//       return;
//     }

//     try {
//       await confirmObj.confirm(otp.trim());
//       alert("✅ Phone number verified!");
//     } catch (error) {
//       console.error("OTP verification failed:", error);
//       alert("❌ Invalid OTP. Please try again.");
//     }
//   };

//   return (
//     <div className="p-4 max-w-sm mx-auto border rounded shadow">
//       <h2 className="text-xl font-bold mb-4">Phone Authentication</h2>

//       <input
//         type="tel"
//         value={mobile}
//         onChange={(e) => setMobile(e.target.value)}
//         placeholder="Enter mobile number"
//         className="border w-full p-2 mb-2"
//         maxLength={10}
//       />

//       <button
//         onClick={sendOtp}
//         className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 mb-4"
//       >
//         Send OTP
//       </button>

//       {/* 👇 Required container for invisible reCAPTCHA */}
//       <div id="recaptcha-container"></div>

//       <input
//         type="text"
//         value={otp}
//         onChange={(e) => setOtp(e.target.value)}
//         placeholder="Enter OTP"
//         className="border w-full p-2 mb-2"
//       />

//       <button
//         onClick={verifyOtp}
//         className="bg-green-600 hover:bg-green-700 text-white w-full py-2"
//       >
//         Verify OTP
//       </button>
//     </div>
//   );
// };

// export default PhoneAuth;
