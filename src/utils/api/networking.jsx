import { labelRoutes } from "../../navigations/labelRoutes";

export const PostApi = (url, data = "", isDashboard=false) => {
  const isFormData = data instanceof FormData;
  const token = localStorage.getItem("token");

  return fetch(url.toString(), {
    method: "POST",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
    body: isFormData ? data : JSON.stringify(data),
  })
    .then(async (response) => {
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.setItem("unAuthorized", true)
        console.log("post api JWT missing/invalid ");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      } else {
        return { status: "F", message: "Unexpected response format" };
      }
    })
    .catch((error) => {
      console.error("POST request failed:", error);
      return {
        status: "F",
        message: error.message || "No response from server",
      };
    });
};


export const GetApi = (url, headers = {}, isDashboard=false) => {
  const token = localStorage.getItem("token");

  return fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
    .then(async (response) => {
      if (response.status === 401) {
        console.error("Unauthorized - JWT missing/invalid");
        localStorage.removeItem("token");
        console.log("getapi JWT missing/invalid ");
        localStorage.setItem("unAuthorized", true)
      }
      const raw = await response.text();
      if (!raw) return { status: "S", data: null };
      try {
        return { status: "S", data: JSON.parse(raw) };
      } catch (err) {
        console.error("❌ Invalid JSON:", raw);
        return { status: "F", message: "Invalid JSON from server" };
      }
    })
    .catch((error) => {
      console.error("GET request failed:", error);
      return {
        status: "F",
        message: error.message || "Network request failed",
      };
    });
};


