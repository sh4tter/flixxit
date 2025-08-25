import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { adminApiCalls } from "../utils/adminApiCalls";
import DragDropUpload from "../components/DragDropUpload";
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
  const [showEditListModal, setShowEditListModal] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [movieSearchTerm, setMovieSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

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
  const handleFileUpload = async (file, field) => {
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

  // Open edit list modal
  const openEditListModal = async (list) => {
    try {
      // Refresh the lists to ensure we have the latest data
      await loadLists();
      
      // Find the updated list
      const updatedLists = await adminApiCalls.getAllLists();
      const updatedList = updatedLists.find(l => l._id === list._id);
      
      if (!updatedList) {
        setMessage("List not found. It may have been deleted.");
        return;
      }
      
      setEditingList(updatedList);
      setListForm({
        title: updatedList.title || "",
        type: updatedList.type || "",
        genre: updatedList.genre || "",
        content: updatedList.content || [],
        isTop10: updatedList.isTop10 || false,
        order: updatedList.order || 0,
      });
      setShowEditListModal(true);
    } catch (error) {
      console.error("Error opening edit modal:", error);
      setMessage("Error loading list data");
    }
  };

  // Close edit list modal
  const closeEditListModal = () => {
    setShowEditListModal(false);
    setEditingList(null);
    setListForm({
      title: "",
      type: "",
      genre: "",
      content: [],
      isTop10: false,
      order: 0,
    });
  };

  // Edit list
  const editList = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate that the list still exists
      if (!editingList || !editingList._id) {
        setMessage("Invalid list data. Please try again.");
        setLoading(false);
        return;
      }
      
      // Filter out any invalid content items
      const validContent = listForm.content.filter(itemId => itemId && itemId.trim() !== '');
      
      const listDataToUpdate = {
        ...listForm,
        content: validContent
      };
      
      // Check if there are any changes
      const originalList = {
        title: editingList.title || "",
        type: editingList.type || "",
        genre: editingList.genre || "",
        content: editingList.content || [],
        isTop10: editingList.isTop10 || false,
        order: editingList.order || 0,
      };
      
      const hasChanges = JSON.stringify(originalList) !== JSON.stringify(listDataToUpdate);
      
      if (!hasChanges) {
        setMessage("No changes detected. List is already up to date.");
        setLoading(false);
        return;
      }
      
      console.log("Updating list with ID:", editingList._id);
      console.log("List data:", listDataToUpdate);
      await adminApiCalls.updateList(editingList._id, listDataToUpdate);
      setMessage("List updated successfully!");
      closeEditListModal();
      loadLists();
    } catch (error) {
      console.error("Error updating list:", error);
      setMessage(`Error updating list: ${error.response?.data?.message || error.message}`);
    }
    setLoading(false);
  };

  // Search movies
  const searchMovies = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    setSearching(true);
    try {
      const results = movies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results.slice(0, 10)); // Limit to 10 results
    } catch (error) {
      console.error("Error searching movies:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Add movie to list
  const addMovieToList = (movie) => {
    if (!listForm.content.includes(movie._id)) {
      setListForm(prev => ({
        ...prev,
        content: [...prev.content, movie._id]
      }));
      setMessage(`Added "${movie.title}" to list`);
    } else {
      setMessage(`"${movie.title}" is already in the list`);
    }
    setMovieSearchTerm("");
    setSearchResults([]);
  };

  // Remove movie from list
  const removeMovieFromList = (index) => {
    const newContent = listForm.content.filter((_, i) => i !== index);
    setListForm(prev => ({ ...prev, content: newContent }));
    setMessage("Movie removed from list");
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
              {/* Basic Information Section */}
              <div className="form-section">
                <h3 className="section-title">Basic Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Movie Title *</label>
                    <input
                      type="text"
                      value={movieForm.title}
                      onChange={(e) => setMovieForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter movie title"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Genre</label>
                    <input
                      type="text"
                      value={movieForm.genre}
                      onChange={(e) => setMovieForm(prev => ({ ...prev, genre: e.target.value }))}
                      placeholder="e.g., Action, Drama, Comedy"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Release Year</label>
                    <input
                      type="text"
                      value={movieForm.year}
                      onChange={(e) => setMovieForm(prev => ({ ...prev, year: e.target.value }))}
                      placeholder="e.g., 2024"
                    />
                  </div>
                  <div className="form-group">
                    <label>Age Limit</label>
                    <input
                      type="number"
                      value={movieForm.limit}
                      onChange={(e) => setMovieForm(prev => ({ ...prev, limit: e.target.value }))}
                      placeholder="e.g., 13, 16, 18"
                      min="0"
                      max="25"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={movieForm.desc}
                    onChange={(e) => setMovieForm(prev => ({ ...prev, desc: e.target.value }))}
                    placeholder="Enter a detailed description of the movie..."
                    rows="4"
                  />
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
              </div>

              {/* Media Upload Section */}
              <div className="form-section">
                <h3 className="section-title">Media Files</h3>

              <div className="upload-grid">
                <DragDropUpload
                  field="imgSm"
                  label="Thumbnail Image"
                  accept="image/*"
                  onUpload={handleFileUpload}
                  currentValue={movieForm.imgSm}
                  type="image"
                  description="Small image used in movie lists and tiles (recommended: 300x450px)"
                />

                <DragDropUpload
                  field="imgTitle"
                  label="Logo Image"
                  accept="image/*"
                  onUpload={handleFileUpload}
                  currentValue={movieForm.imgTitle}
                  type="image"
                  description="Logo overlay for hero banners (recommended: 400x200px, transparent background)"
                />

                <DragDropUpload
                  field="img"
                  label="Poster Image"
                  accept="image/*"
                  onUpload={handleFileUpload}
                  currentValue={movieForm.img}
                  type="image"
                  description="Main poster image (recommended: 1000x1500px)"
                />

                <DragDropUpload
                  field="video"
                  label="Movie Video"
                  accept="video/*"
                  onUpload={handleFileUpload}
                  currentValue={movieForm.video}
                  type="video"
                  description="Main movie video file (MP4, WebM, or MOV)"
                />
              </div>

                <div className="form-group">
                  <label>Trailer URL</label>
                  <input
                    type="url"
                    value={movieForm.trailer}
                    onChange={(e) => setMovieForm(prev => ({ ...prev, trailer: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <small className="form-help">Optional: YouTube or Vimeo trailer URL</small>
                </div>
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
                    <div className="list-actions">
                      <button onClick={() => openEditListModal(list)} className="edit-btn">
                        Edit
                      </button>
                      <button onClick={() => deleteList(list._id)} className="delete-btn">
                        Delete
                      </button>
                    </div>
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
          <div className="modal-content edit-movie-modal" onClick={(e) => e.stopPropagation()}>
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
              {/* Basic Information Section */}
              <div className="form-section">
                <h3 className="section-title">Basic Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Movie Title *</label>
                    <input
                      type="text"
                      value={movieForm.title}
                      onChange={(e) => setMovieForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter movie title"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Genre</label>
                    <input
                      type="text"
                      value={movieForm.genre}
                      onChange={(e) => setMovieForm(prev => ({ ...prev, genre: e.target.value }))}
                      placeholder="e.g., Action, Drama, Comedy"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Release Year</label>
                    <input
                      type="text"
                      value={movieForm.year}
                      onChange={(e) => setMovieForm(prev => ({ ...prev, year: e.target.value }))}
                      placeholder="e.g., 2024"
                    />
                  </div>
                  <div className="form-group">
                    <label>Age Limit</label>
                    <input
                      type="number"
                      value={movieForm.limit}
                      onChange={(e) => setMovieForm(prev => ({ ...prev, limit: e.target.value }))}
                      placeholder="e.g., 13, 16, 18"
                      min="0"
                      max="25"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={movieForm.desc}
                    onChange={(e) => setMovieForm(prev => ({ ...prev, desc: e.target.value }))}
                    placeholder="Enter a detailed description of the movie..."
                    rows="4"
                  />
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
              </div>

              {/* Media Upload Section */}
              <div className="form-section">
                <h3 className="section-title">Media Files</h3>
                
                <div className="upload-grid">
                  <DragDropUpload
                    field="imgSm"
                    label="Thumbnail Image"
                    accept="image/*"
                    onUpload={handleFileUpload}
                    currentValue={movieForm.imgSm}
                    type="image"
                    description="Small image used in movie lists and tiles (recommended: 300x450px)"
                  />

                  <DragDropUpload
                    field="imgTitle"
                    label="Logo Image"
                    accept="image/*"
                    onUpload={handleFileUpload}
                    currentValue={movieForm.imgTitle}
                    type="image"
                    description="Logo overlay for hero banners (recommended: 400x200px, transparent background)"
                  />

                  <DragDropUpload
                    field="img"
                    label="Poster Image"
                    accept="image/*"
                    onUpload={handleFileUpload}
                    currentValue={movieForm.img}
                    type="image"
                    description="Main poster image (recommended: 1000x1500px)"
                  />

                  <DragDropUpload
                    field="video"
                    label="Movie Video"
                    accept="video/*"
                    onUpload={handleFileUpload}
                    currentValue={movieForm.video}
                    type="video"
                    description="Main movie video file (MP4, WebM, or MOV)"
                  />
                </div>

                <div className="form-group">
                  <label>Trailer URL</label>
                  <input
                    type="url"
                    value={movieForm.trailer}
                    onChange={(e) => setMovieForm(prev => ({ ...prev, trailer: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <small className="form-help">Optional: YouTube or Vimeo trailer URL</small>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={closeEditModal}>
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={loading || uploading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit List Modal */}
      {showEditListModal && (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content edit-list-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit List: {editingList?.title}</h2>
              <button 
                className="modal-close" 
                onClick={closeEditListModal}
                title="Close modal"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={editList} className="dashboard-form">
              <div className="form-section">
                <h3 className="section-title">List Information</h3>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={listForm.title}
                    onChange={(e) => setListForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter list title"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Type</label>
                    <input
                      type="text"
                      value={listForm.type}
                      onChange={(e) => setListForm(prev => ({ ...prev, type: e.target.value }))}
                      placeholder="e.g., movie, series, trending"
                    />
                  </div>
                  <div className="form-group">
                    <label>Genre</label>
                    <input
                      type="text"
                      value={listForm.genre}
                      onChange={(e) => setListForm(prev => ({ ...prev, genre: e.target.value }))}
                      placeholder="e.g., Action, Drama, Comedy"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Order</label>
                    <input
                      type="number"
                      value={listForm.order}
                      onChange={(e) => setListForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      placeholder="Display order (lower numbers first)"
                      min="0"
                    />
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
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">List Content</h3>
                <div className="content-management">
                  <div className="content-info">
                    <p>Current content: {listForm.content.length} items</p>
                    <small>Search and add movies to this list</small>
                  </div>
                  
                  {/* Movie Search */}
                  <div className="movie-search">
                    <div className="search-input">
                      <input
                        type="text"
                        value={movieSearchTerm}
                        onChange={(e) => {
                          setMovieSearchTerm(e.target.value);
                          searchMovies(e.target.value);
                        }}
                        placeholder="Search movies by title or genre..."
                        className="search-field"
                      />
                      {searching && <span className="search-loading">Searching...</span>}
                    </div>
                    
                    {/* Search Results */}
                    {searchResults.length > 0 && (
                      <div className="search-results">
                        <h4>Search Results:</h4>
                        <div className="movie-results">
                          {searchResults.map((movie) => (
                            <div key={movie._id} className="movie-result-item">
                              <div className="movie-info">
                                <span className="movie-title">{movie.title}</span>
                                <span className="movie-genre">{movie.genre} • {movie.year}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => addMovieToList(movie)}
                                className="add-movie-btn"
                                disabled={listForm.content.includes(movie._id)}
                              >
                                {listForm.content.includes(movie._id) ? 'Added' : 'Add'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Current List Content */}
                  {listForm.content.length > 0 && (
                    <div className="content-preview">
                      <h4>Current List Content: <small>(Drag to reorder)</small></h4>
                      <div className="content-items">
                        {listForm.content.map((itemId, index) => {
                          const movie = movies.find(m => m._id === itemId);
                          return (
                            <div
                              key={`${itemId}-${index}`}
                              className="content-item"
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', itemId);
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                const draggedItemId = e.dataTransfer.getData('text/plain');
                                const draggedItemIndex = listForm.content.indexOf(draggedItemId);
                                const newContent = Array.from(listForm.content);
                                newContent.splice(draggedItemIndex, 1);
                                newContent.splice(index, 0, draggedItemId);
                                setListForm(prev => ({ ...prev, content: newContent }));
                                setMessage("List order updated");
                              }}
                            >
                              <div className="drag-handle">
                                <span className="drag-icon">⋮⋮</span>
                              </div>
                              <span className="item-number">{index + 1}</span>
                              <div className="item-info">
                                <span className="item-title">{movie ? movie.title : 'Unknown Movie'}</span>
                                <span className="item-id">{itemId}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeMovieFromList(index)}
                                className="remove-item-btn"
                              >
                                Remove
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={closeEditListModal}>
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={loading}>
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
