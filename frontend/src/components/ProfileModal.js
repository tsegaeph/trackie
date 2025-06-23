/*import React, { useState, useEffect } from "react";
import "./ProfileModal.css";

function ProfileModal({ isOpen, onClose, profileData, setProfileData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profileData.name || "");
  const [editedEmail, setEditedEmail] = useState(profileData.email || "");
  const [editedImageUrl, setEditedImageUrl] = useState(profileData.image || "");
  const [editedImageFile, setEditedImageFile] = useState(null); // store actual file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // When profileData changes (e.g. modal re-opens), reset fields
  useEffect(() => {
    setEditedName(profileData.name || "");
    setEditedEmail(profileData.email || "");
    setEditedImageUrl(profileData.image || "");
    setEditedImageFile(null);
  }, [profileData]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", editedName);
      formData.append("email", editedEmail);
      if (editedImageFile) {
        formData.append("image", editedImageFile);
      }

      const response = await fetch(`/api/profile/${profileData._id}`, {
        method: "PUT",
        body: formData, // don't set Content-Type, browser will set it automatically
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to update profile");
      }

      const data = await response.json();
      setProfileData(data); // update parent with new profile
      setIsEditing(false);
      onClose();
    } catch (err) {
      setError(err.message);
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedImageFile(file); // store the file for upload

      // For preview, convert to base64 URL
      const reader = new FileReader();
      reader.onload = () => {
        setEditedImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Profile</h2>
        <div className="modal-profile-image">
          <img
            src={editedImageUrl || "/images/placeholder-profile.png"}
            alt="Profile"
            className="circle-image"
          />
          {isEditing && (
            <label className="upload-button">
              +
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
              />
            </label>
          )}
        </div>

        {isEditing ? (
          <>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Name"
              disabled={loading}
            />
            <input
              type="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              placeholder="Email"
              disabled={loading}
            />
            {error && <p className="error-message">{error}</p>}
            <div className="modal-actions">
              <button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setError(null);
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              <strong>Name:</strong> {profileData.name}
            </p>
            <p>
              <strong>Email:</strong> {profileData.email}
            </p>
            <div className="modal-actions">
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileModal;*/
