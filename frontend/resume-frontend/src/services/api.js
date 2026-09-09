import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  timeout: 30000,
});

// Add access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired access tokens
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // No response means server/network problem
    if (!error.response) {
      return Promise.reject({
        ...error,
        userMessage:
          "Unable to connect to the server. Please make sure the backend is running.",
      });
    }

    // Don't try refreshing the token for the refresh endpoint itself
    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/users/refresh/")
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";

        return Promise.reject({
          ...error,
          userMessage: "Your session has expired. Please login again.",
        });
      }

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/users/refresh/",
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = response.data.access;

        localStorage.setItem("access_token", newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";

        return Promise.reject({
          ...refreshError,
          userMessage: "Your session has expired. Please login again.",
        });
      }
    }

    // Useful messages for common HTTP errors
    let userMessage = "Something went wrong. Please try again.";

    if (error.response.status === 400) {
      userMessage =
        "The information you submitted is invalid. Please check your input.";
    } else if (error.response.status === 403) {
      userMessage =
        "You do not have permission to perform this action.";
    } else if (error.response.status === 404) {
      userMessage =
        "The requested resource could not be found.";
    } else if (error.response.status === 429) {
      userMessage =
        "Too many requests. Please wait a moment and try again.";
    } else if (error.response.status >= 500) {
      userMessage =
        "The server encountered an error. Please try again later.";
    }

    return Promise.reject({
      ...error,
      userMessage,
    });
  }
);

export default api;