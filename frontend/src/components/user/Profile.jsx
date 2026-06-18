import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import { UnderlineNav, Button } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";
import { API_URL } from "../../config";

const Profile = () => {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    username: "loading...",
    email: "",
    description: "",
    profileImage: "",
    repositories: [],
    starRepos: [],
  });

  const [view, setView] = useState("overview");
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(`${API_URL}/userProfile/${userId}`);
          setUserDetails(response.data);
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <>
      <Navbar />

      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item
          aria-current={view === "overview" ? "page" : undefined}
          onClick={() => setView("overview")}
          icon={BookIcon}
          sx={{
            backgroundColor: "transparent",
            color: "white",
            cursor: "pointer",
          }}
        >
          Overview
        </UnderlineNav.Item>

        <UnderlineNav.Item
          aria-current={view === "starred" ? "page" : undefined}
          onClick={() => setView("starred")}
          icon={RepoIcon}
          sx={{
            backgroundColor: "transparent",
            color: "whitesmoke",
            cursor: "pointer",
          }}
        >
          Starred Repositories
        </UnderlineNav.Item>
      </UnderlineNav>

      <div className="profile-page-wrapper">
        <div className="user-profile-section">
          <div className="profile-image">
            {userDetails.profileImage ? (
              <img
                src={userDetails.profileImage}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div style={{ fontSize: "50px" }}>👤</div>
            )}
          </div>

          <div className="name">
            <h3>{userDetails.username}</h3>
            <p style={{ color: "#8b949e" }}>{userDetails.email}</p>
          </div>

          <div
            style={{
              margin: "10px 0",
              color: "#c9d1d9",
              fontStyle: "italic",
              fontSize: "14px",
            }}
          >
            {userDetails.description || "No bio available."}
          </div>

          <Button
            onClick={() => navigate("/settings")}
            style={{ width: "100%", marginBottom: "10px" }}
          >
            Edit Profile
          </Button>

          <div className="follower">
            <p>10 Followers</p>
            <p>3 Following</p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
              setCurrentUser(null);
              window.location.href = "/auth";
            }}
            id="logout"
            style={{ marginTop: "20px" }}
          >
            Logout
          </button>
        </div>

        <div className="heat-map-section">
          {view === "overview" ? (
            <HeatMapProfile repos={userDetails.repositories} />
          ) : (
            <div className="starred-list">
              <h3
                style={{
                  marginBottom: "20px",
                  borderBottom: "1px solid #30363d",
                  paddingBottom: "10px",
                }}
              >
                Starred Repositories
              </h3>
              {userDetails.starRepos && userDetails.starRepos.length > 0 ? (
                userDetails.starRepos.map((repo) => (
                  <div
                    key={repo._id}
                    style={{
                      padding: "15px",
                      borderBottom: "1px solid #30363d",
                      cursor: "pointer",
                      backgroundColor: "#161b22",
                      marginBottom: "10px",
                      borderRadius: "6px",
                    }}
                    onClick={() => navigate(`/repo/${repo._id}`)}
                  >
                    <h4 style={{ color: "#58a6ff", marginBottom: "5px" }}>
                      {repo.name}
                    </h4>
                    <p
                      style={{ color: "#8b949e", fontSize: "14px", margin: 0 }}
                    >
                      {repo.description || "No description"}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ color: "#8b949e" }}>
                  You haven't starred any repositories yet.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
