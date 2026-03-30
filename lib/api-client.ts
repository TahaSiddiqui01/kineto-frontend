export const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });


    // 1. Check for HTTP errors (4xx or 5xx)
    if (!response.ok) {
      let errorMessage = `Error: ${response.status} ${response.statusText}`;
      let errorData;

      try {
        // Attempt to parse the error body from the server
        errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Fallback if the response isn't JSON (e.g., a 504 Gateway Timeout)
      }

      // Throw an object so the UI can handle specific status codes
      throw {
        status: response.status,
        message: errorMessage,
        data: errorData,
      };
    }

    // 2. Handle empty responses (204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();

  } catch (error: any) {
    // 3. Handle Network Failures (DNS, Offline, CORS)
    if (!error.status) {
      console.error("Network or Syntax Error:", error);
      throw new Error("A network error occurred. Please check your connection.");
    }
    
    // Re-throw the structured error from step 1
    throw error;
  }
};