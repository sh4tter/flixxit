import axiosInstance from './axiosInstance';

export const adminApiCalls = {
  // Movie management
  getAllMovies: async () => {
    try {
      const response = await axiosInstance.get("movies");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createMovie: async (movieData) => {
    try {
      const response = await axiosInstance.post("movies", movieData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateMovie: async (id, movieData) => {
    try {
      const response = await axiosInstance.put(`movies/${id}`, movieData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteMovie: async (id) => {
    try {
      const response = await axiosInstance.delete(`movies/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // List management
  getAllLists: async () => {
    try {
      const response = await axiosInstance.get("lists/admin/all");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createList: async (listData) => {
    try {
      const response = await axiosInstance.post("lists", listData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteList: async (id) => {
    try {
      const response = await axiosInstance.delete(`lists/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // File upload helper - now uses backend endpoint
  uploadToCloudinary: async (file, type = "image") => {
    try {
      const formData = new FormData();
      formData.append(type, file);

      const response = await axiosInstance.post(`upload/${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.url) {
        return response.data.url;
      } else {
        throw new Error("Upload failed: No URL returned");
      }
    } catch (error) {
      console.error("Upload error:", error);
      if (error.response?.data?.message) {
        throw new Error(`Upload failed: ${error.response.data.message}`);
      } else {
        throw new Error("Upload failed. Please try again.");
      }
    }
  }
};
