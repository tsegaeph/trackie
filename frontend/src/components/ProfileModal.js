import React, { useState } from "react";
import "./ProfileModal.css";

function ProfileModal({ isOpen, onClose, profileData, setProfileData }) {
  // ✅ Hooks must always be declared first (outside conditionals)
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profileData.name);
  const [editedEmail, setEditedEmail] = useState(profileData.email);
  const [editedImage, setEditedImage] = useState(profileData.image);

  // ✅ This check can be placed *after* hooks
  if (!isOpen) return null;

  const handleSave = () => {
    setProfileData({
      name: editedName,
      email: editedEmail,
      image: editedImage,
    });
    setIsEditing(false);
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditedImage(reader.result);
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
            src={editedImage || "/images/placeholder-profile.png"}
            alt="Profile"
            className="circle-image"
          />
          <label className="upload-button">
            +
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>

        {isEditing ? (
          <>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Name"
            />
            <input
              type="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              placeholder="Email"
            />
            <div className="modal-actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {profileData.name}</p>
            <p><strong>Email:</strong> {profileData.email}</p>
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

export default ProfileModal;
