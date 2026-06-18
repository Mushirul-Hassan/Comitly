import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(`${API_URL}/repo/user/${userId}`);
        const data = await response.json();
        setRepositories(data.repositories || []);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
        setRepositories([]);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`${API_URL}/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim() === "") {
        setSearchResults(repositories);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/repo/search?query=${searchQuery}`,
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        console.error("Error searching repos:", err);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar />
      <section id="dashboard">
        <aside>
          <h3>Suggested Repositories</h3>
          {suggestedRepositories.map((repo) => {
            return (
              <div
                key={repo._id}
                className="repo-card"
                onClick={() => navigate(`/repo/${repo._id}`)}
                style={{ cursor: "pointer" }}
              >
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
              </div>
            );
          })}
        </aside>
        <main>
          <h2>{searchQuery ? "Search Results" : "Your Repositories"}</h2>
          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchResults.map((repo) => {
            return (
              <div
                key={repo._id}
                className="repo-card"
                onClick={() => navigate(`/repo/${repo._id}`)}
                style={{
                  cursor: "pointer",
                  border: "1px solid #333",
                  padding: "10px",
                  margin: "10px 0",
                }}
              >
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
                <span style={{ fontSize: "12px", color: "#888" }}>
                  {repo.visibility ? "Public" : "Private"}
                </span>
              </div>
            );
          })}
        </main>
        <aside>
          <h3>Upcoming Events</h3>
          <ul>
            <li>
              <p>Tech Conference - Dec 15</p>
            </li>
            <li>
              <p>Developer Meetup - Dec 25</p>
            </li>
            <li>
              <p>React Summit - Jan 5</p>
            </li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
