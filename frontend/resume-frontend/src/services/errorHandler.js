export function getErrorMessage(error, fallback = "Something went wrong.") {
  if (error?.userMessage) {
    return error.userMessage;
  }

  if (error?.response?.data) {
    const data = error.response.data;

    if (typeof data === "string") {
      return data;
    }

    if (data.detail) {
      return data.detail;
    }

    if (data.message) {
      return data.message;
    }

    // Django/DRF validation errors
    const firstError = Object.values(data)[0];

    if (Array.isArray(firstError) && firstError.length > 0) {
      return firstError[0];
    }

    if (typeof firstError === "string") {
      return firstError;
    }
  }

  if (error?.message) {
    return error.message;
  }

  return fallback;
}