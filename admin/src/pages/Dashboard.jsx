import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { adminApiCalls } from "../utils/adminApiCalls";
import "./Dashboard.scss";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("movies");
  const [movies, setMovies] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  // Movie form state
  const [movieForm, setMovieForm] = useState({
    title: "",
    desc: "",
    img: "",
    imgTitle: "",
    imgSm: "",
    trailer: "",
    video: "",
    year: "",
    limit: "",
    genre: "",
    isSeries: false,
  });

  // List form state
  const [listForm, setListForm] = useState({
    title: "",
    type: "",
    genre: "",
    content: [],
    isTop10: false,
    order: 0,
  });

  // Cloudinary upload state
  const [uploading, setUploading] = useState(false);

  // Cloudinary upload function
  const uploadToCloudinary = async (file, type = "image") => {
    setUploading(true);
    try {
      const url = await adminApiCalls.uploadToCloudinary(file, type);
      setUploading(false);
      return url;
    } catch (error) {
      console.error("Upload error:", error);
      setUploading(false);
      throw error;
    }
  };

  // Handle file upload
  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const url = await uploadToCloudinary(file, field === "video" ? "video" : "image");
      setMovieForm(prev => ({ ...prev, [field]: url }));
      setMessage(`${field} uploaded successfully!`);
    } catch {
      setMessage("Upload failed. Please try again.");
    }
  };

  // Load movies
  const loadMovies = async () => {
    try {
      const data = await adminApiCalls.getAllMovies();
      setMovies(data);
    } catch {
      console.error("Error loading movies");
    }
  };

  // Load lists
  const loadLists = async () => {
    try {
      const data = await adminApiCalls.getAllLists();
      setLists(data);
    } catch {
      console.error("Error loading lists");
    }
  };

  // Create movie
  const createMovie = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminApiCalls.createMovie(movieForm);
      setMessage("Movie created successfully!");
      setMovieForm({
        title: "",
        desc: "",
        img: "",
        imgTitle: "",
        imgSm: "",
        trailer: "",
        video: "",
        year: "",
        limit: "",
        genre: "",
        isSeries: false,
      });
      loadMovies();
    } catch {
      setMessage("Error creating movie");
    }
    setLoading(false);
  };

  // Edit movie
  const editMovie = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminApiCalls.updateMovie(editingMovie._id, movieForm);
      setMessage("Movie updated successfully!");
      closeEditModal();
      loadMovies();
    } catch {
      setMessage("Error updating movie");
    }
    setLoading(false);
  };

  // Open edit modal
  const openEditModal = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title || "",
      desc: movie.desc || "",
      img: movie.img || "",
      imgTitle: movie.imgTitle || "",
      imgSm: movie.imgSm || "",
      trailer: movie.trailer || "",
      video: movie.video || "",
      year: movie.year || "",
      limit: movie.limit || "",
      genre: movie.genre || "",
      isSeries: movie.isSeries || false,
    });
    setShowEditModal(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingMovie(null);
    setMovieForm({
      title: "",
      desc: "",
      img: "",
      imgTitle: "",
      imgSm: "",
      trailer: "",
      video: "",
      year: "",
      limit: "",
      genre: "",
      isSeries: false,
    });
  };

  // Create list
  const createList = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminApiCalls.createList(listForm);
      setMessage("List created successfully!");
      setListForm({
        title: "",
        type: "",
        genre: "",
        content: [],
        isTop10: false,
        order: 0,
      });
      loadLists();
    } catch {
      setMessage("Error creating list");
    }
    setLoading(false);
  };

  // Delete list
  const deleteList = async (id) => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      try {
        await adminApiCalls.deleteList(id);
        setMessage("List deleted successfully!");
        loadLists();
      } catch {
        setMessage("Error deleting list");
      }
    }
  };

  useEffect(() => {
    loadMovies();
    loadLists();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Flixxit Admin Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.username}</span>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-container">
        {message && (
          <div className={`message ${message.includes("successfully") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <div className="dashboard-tabs">
          <button 
            className={activeTab === "movies" ? "active" : ""} 
            onClick={() => setActiveTab("movies")}
          >
            Movies
          </button>
          <button 
            className={activeTab === "lists" ? "active" : ""} 
            onClick={() => setActiveTab("lists")}
          >
            Lists
          </button>
        </div>

        {activeTab === "movies" && (
          <div className="dashboard-section">
            <h2>Add New Movie</h2>
            <form onSubmit={createMovie} className="dashboard-form">
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={movieForm.title}
                  onChange={(e) => setMovieForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={movieForm.desc}
                  onChange={(e) => setMovieForm(prev => ({ ...prev, desc: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Thumbnail (for list tiles):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "imgSm")}
                />
                {movieForm.imgSm && (
                  <img src={movieForm.imgSm} alt="Thumbnail" className="preview-image" />
                )}
              </div>

              <div className="form-group">
                <label>Logo (for hero banner overlay):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "imgTitle")}
                />
                {movieForm.imgTitle && (
                  <img src={movieForm.imgTitle} alt="Logo" className="preview-image" />
                )}
              </div>

              <div className="form-group">
                <label>Poster (big image):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "img")}
                />
                {movieForm.img && (
                  <img src={movieForm.img} alt="Poster" className="preview-image" />
                )}
              </div>

              <div className="form-group">
                <label>Video:</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e, "video")}
                />
              </div>

              <div className="form-group">
                <label>Trailer URL:</label>
                <input
                  type="url"
                  value={movieForm.trailer}
                  onChange={(e) => setMovieForm(prev => ({ ...prev, trailer: e.target.value }))}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Year:</label>
                  <input
                    type="text"
                    value={movieForm.year}
                    onChange={(e) => setMovieForm(prev => ({ ...prev, year: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Age Limit:</label>
                  <input
                    type="number"
                    value={movieForm.limit}
                    onChange={(e) => setMovieForm(prev => ({ ...prev, limit: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Genre:</label>
                  <input
                    type="text"
                    value={movieForm.genre}
                    onChange={(e) => setMovieForm(prev => ({ ...prev, genre: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={movieForm.isSeries}
                    onChange={(e) => setMovieForm(prev => ({ ...prev, isSeries: e.target.checked }))}
                  />
                  Is Series
                </label>
              </div>

              <button type="submit" disabled={loading || uploading}>
                {loading ? "Creating..." : "Create Movie"}
              </button>
            </form>

            <h2>Existing Movies</h2>
            <div className="movies-grid">
              {movies.map((movie) => (
                <div 
                  key={movie._id} 
                  className="movie-card"
                  onClick={() => openEditModal(movie)}
                >
                  <img src={movie.imgSm || movie.img} alt={movie.title} />
                  <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <p>{movie.genre} • {movie.year}</p>
                    <span className="click-hint">Click to edit</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "lists" && (
          <div className="dashboard-section">
            <h2>Add New List</h2>
            <form onSubmit={createList} className="dashboard-form">
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={listForm.title}
                  onChange={(e) => setListForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type:</label>
                  <input
                    type="text"
                    value={listForm.type}
                    onChange={(e) => setListForm(prev => ({ ...prev, type: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Genre:</label>
                  <input
                    type="text"
                    value={listForm.genre}
                    onChange={(e) => setListForm(prev => ({ ...prev, genre: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Order:</label>
                  <input
                    type="number"
                    value={listForm.order}
                    onChange={(e) => setListForm(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={listForm.isTop10}
                    onChange={(e) => setListForm(prev => ({ ...prev, isTop10: e.target.checked }))}
                  />
                  Top 10 List
                </label>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create List"}
              </button>
            </form>

            <h2>Existing Lists</h2>
            <div className="lists-grid">
              {lists.map((list) => (
                <div key={list._id} className="list-card">
                  <div className="list-info">
                    <h3>{list.title}</h3>
                    <p>{list.type} • {list.genre}</p>
                    {list.isTop10 && <span className="top10-badge">Top 10</span>}
                    <button onClick={() => deleteList(list._id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Movie Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Movie: {editingMovie?.title}</h2>
              <button 
                className="modal-close" 
                onClick={closeEditModal}
                title="Close modal"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={editMovie} className="dashboard-form">
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={movieForm.title}
                  onChange={(e) => setMovieForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={movieForm.desc}
                  onChange={(e) => setMovieForm(prev => ({ ...prev, desc: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Thumbnail (for list tiles):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "imgSm")}
                />
                {movieForm.imgSm && (
                  <img src={movieForm.imgSm} alt="Thumbnail" className="preview-image" />
                )}
              </div>

              <div className="form-group">
                <label>Logo (for hero banner overlay):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "imgTitle")}
                />
                {movieForm.imgTitle && (
                  <img src={movieForm.imgTitle} alt="Logo" className="preview-image" />
                )}
              </div>

              <div className="form-group">
                <label>Poster (big image):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "img")}
                />
                {movieForm.img && (
                  <img src={movieForm.img} alt="Poster" className="preview-image" />
                )}
              </div>

              <div className="form-group">
                <label>Video:</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e, "video")}
                />
              </div>

              <div className="form-group">
                <label>Trailer URL:</label>
                <input
                  type="url"
                  value={movieForm.trailer}
                  onChange={(e) => setMovieForm(prev => ({ ...prev, trailer: e.target.value }))}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Year:</label>
                  <input
                    type="text"
                    value={movieForm.year}
                    onChange={(e) => setMovieForm(prev => ({ ...prev, year: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Age Limit:</label>
                  <input
                    type="number"
                    value={movieForm.limit}
                    onChange={(e) => setMovieForm(prev => ({ ...prev, limit: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Genre:</label>
                  <input
                    type="text"
                    value={movieForm.genre}
                    onChange={(e) => setMovieForm(prev => ({ ...prev, genre: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={movieForm.isSeries}
                    onChange={(e) => setMovieForm(prev => ({ ...prev, isSeries: e.target.checked }))}
                  />
                  Is Series
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeEditModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" disabled={loading || uploading} className="save-btn">
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
