import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import { Button, UnderlineNav } from "@primer/react";
import {
  RepoIcon,
  IssueOpenedIcon,
  CodeIcon,
  FileIcon,
  StarIcon,
  StarFillIcon,
  BookIcon,
  PencilIcon,
  TrashIcon,
  GitCommitIcon,
  RepoForkedIcon,
} from "@primer/octicons-react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./repoDetails.css";
import { API_URL } from "../../config";

const RepoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [issues, setIssues] = useState([]);
  const [files, setFiles] = useState([]);
  const [commits, setCommits] = useState([]);
  const [activeTab, setActiveTab] = useState("code");
  const [isStarred, setIsStarred] = useState(false);

  const [newIssueTitle, setNewIssueTitle] = useState("");
  const [newIssueDesc, setNewIssueDesc] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [newFileName, setNewFileName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");
  const [showAddFile, setShowAddFile] = useState(false);

  const [readmeContent, setReadmeContent] = useState(null);

  useEffect(() => {
    const fetchRepoData = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const repoRes = await axios.get(`${API_URL}/repo/${id}`);
        const issuesRes = await axios.get(`${API_URL}/issue/all/${id}`);
        const userRes = await axios.get(`${API_URL}/userProfile/${userId}`);

        const repoData = Array.isArray(repoRes.data)
          ? repoRes.data[0]
          : repoRes.data;

        setRepo(repoData);
        setFiles(repoData.content || []);
        setCommits(repoData.commits || []);
        setIssues(issuesRes.data);

        if (userRes.data.starRepos.includes(id)) {
          setIsStarred(true);
        }

        const readmeFile = repoData.content.find(
          (file) => file.name === "README.md" || file.name === "readme.md",
        );
        if (readmeFile) {
          setReadmeContent(readmeFile.content);
        }
      } catch (err) {
        console.error("Error fetching details:", err);
      }
    };
    fetchRepoData();
  }, [id]);

  const handleStar = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const res = await axios.put(`${API_URL}/star/${userId}`, { id: id });
      setIsStarred(res.data.starred);
    } catch (err) {
      console.error("Error starring repo:", err);
    }
  };

  const handleFork = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const res = await axios.post(`${API_URL}/repo/fork/${id}`, {
        userId: userId,
      });

      alert("Repository Forked! Redirecting...");

      navigate(`/repo/${res.data.repo._id}`);
      window.location.reload();
    } catch (err) {
      console.error("Error forking repo:", err);
      alert("Failed to fork repository.");
    }
  };

  const handleFileClick = async (fileName) => {
    try {
      const res = await axios.get(`${API_URL}/repo/file/${id}/${fileName}`);
      setSelectedFile(fileName);
      setFileContent(res.data.content);
      setIsEditing(false);
    } catch (err) {
      console.error("Error fetching file:", err);
    }
  };

  const handleAddFile = async () => {
    if (!newFileName || !newFileContent) return alert("Please fill details");
    try {
      const res = await axios.post(`${API_URL}/repo/file/create/${id}`, {
        name: newFileName,
        content: newFileContent,
      });
      setFiles([...files, res.data.file]);

      if (res.data.file.name === "README.md") {
        setReadmeContent(res.data.file.content);
      }

      setShowAddFile(false);
      setNewFileName("");
      setNewFileContent("");
      alert("File Added!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${API_URL}/repo/file/update/${id}`, {
        name: selectedFile,
        content: fileContent,
      });

      if (selectedFile === "README.md") {
        setReadmeContent(fileContent);
      }

      setIsEditing(false);
      alert("File Updated Successfully!");
    } catch (err) {
      console.error("Error updating file:", err);
      alert("Failed to update file.");
    }
  };

  const handleDeleteFile = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedFile}?`))
      return;
    try {
      await axios.delete(`${API_URL}/repo/file/delete/${id}`, {
        data: { name: selectedFile },
      });

      setFiles(files.filter((f) => f.name !== selectedFile));
      if (selectedFile === "README.md") setReadmeContent(null);
      setSelectedFile(null);
      setFileContent("");
      alert("File Deleted!");
    } catch (err) {
      console.error("Error deleting file:", err);
      alert("Failed to delete file.");
    }
  };

  const handleCreateIssue = async () => {
    if (!newIssueTitle) return;
    try {
      const res = await axios.post(`${API_URL}/issue/create/${id}`, {
        title: newIssueTitle,
        description: newIssueDesc,
      });
      setIssues([...issues, res.data]);
      setNewIssueTitle("");
      setNewIssueDesc("");
      alert("Issue Created!");
    } catch (err) {
      console.error(err);
    }
  };

  if (!repo) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="repo-details-wrapper">
        <div className="repo-details-container">
          <div className="repo-header">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <RepoIcon size={24} className="fgColor-muted" />
              <h1 className="repo-title">{repo.name}</h1>
            </div>

            <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
              <button onClick={handleFork} className="star-btn">
                <RepoForkedIcon /> Fork
              </button>

              <button onClick={handleStar} className="star-btn">
                {isStarred ? <StarFillIcon fill="#e3b341" /> : <StarIcon />}
                {isStarred ? "Starred" : "Star"}
              </button>
            </div>
          </div>

          <div className="repo-tab-nav">
            <UnderlineNav aria-label="Repository">
              <UnderlineNav.Item
                aria-current={activeTab === "code" ? "page" : undefined}
                onClick={() => setActiveTab("code")}
                icon={CodeIcon}
              >
                Code
              </UnderlineNav.Item>
              <UnderlineNav.Item
                aria-current={activeTab === "issues" ? "page" : undefined}
                onClick={() => setActiveTab("issues")}
                icon={IssueOpenedIcon}
                counter={issues.length}
              >
                Issues
              </UnderlineNav.Item>
              <UnderlineNav.Item
                aria-current={activeTab === "commits" ? "page" : undefined}
                onClick={() => setActiveTab("commits")}
                icon={GitCommitIcon}
                counter={commits.length}
              >
                Commits
              </UnderlineNav.Item>
            </UnderlineNav>
          </div>

          <div className="repo-content">
            {activeTab === "code" && (
              <div>
                {selectedFile ? (
                  <div className="file-viewer">
                    <div className="file-header">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                          {selectedFile}
                        </span>
                        {isEditing && (
                          <span style={{ fontSize: "12px", color: "#e3b341" }}>
                            (Editing...)
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        {isEditing ? (
                          <>
                            <Button variant="primary" onClick={handleSaveEdit}>
                              Save Changes
                            </Button>
                            <Button onClick={() => setIsEditing(false)}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setIsEditing(true)}
                              className="icon-btn"
                              title="Edit File"
                            >
                              <PencilIcon />
                            </button>
                            <button
                              onClick={handleDeleteFile}
                              className="icon-btn danger"
                              title="Delete File"
                            >
                              <TrashIcon />
                            </button>
                            <Button onClick={() => setSelectedFile(null)}>
                              Close
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    {isEditing ? (
                      <textarea
                        value={fileContent}
                        onChange={(e) => setFileContent(e.target.value)}
                        className="code-editor"
                        spellCheck="false"
                      />
                    ) : (
                      <SyntaxHighlighter
                        language={selectedFile.split(".").pop()}
                        style={dracula}
                        customStyle={{
                          margin: 0,
                          borderRadius: "0 0 6px 6px",
                          fontSize: "14px",
                          minHeight: "400px",
                        }}
                        showLineNumbers={true}
                      >
                        {fileContent}
                      </SyntaxHighlighter>
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <h3>Files</h3>
                      <Button
                        onClick={() => setShowAddFile(!showAddFile)}
                        variant="primary"
                      >
                        + Add File
                      </Button>
                    </div>
                    {showAddFile && (
                      <div className="add-file-box">
                        <input
                          className="issue-input"
                          placeholder="File Name (e.g., index.js)"
                          value={newFileName}
                          onChange={(e) => setNewFileName(e.target.value)}
                        />
                        <textarea
                          className="issue-input"
                          placeholder="Code Content..."
                          value={newFileContent}
                          onChange={(e) => setNewFileContent(e.target.value)}
                          style={{ minHeight: "100px" }}
                        />
                        <Button variant="primary" onClick={handleAddFile}>
                          Commit New File
                        </Button>
                      </div>
                    )}
                    <ul className="file-list">
                      {files.map((file, index) => (
                        <li
                          key={index}
                          className="file-item"
                          onClick={() => handleFileClick(file.name)}
                        >
                          <FileIcon className="fgColor-muted" />
                          <span>{file.name}</span>
                        </li>
                      ))}
                      {files.length === 0 && <p>No files yet.</p>}
                    </ul>
                    {readmeContent && (
                      <div className="readme-section">
                        <div className="readme-header">
                          <BookIcon className="fgColor-muted" />
                          <span>README.md</span>
                        </div>
                        <div className="readme-body">
                          <Markdown>{readmeContent}</Markdown>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "commits" && (
              <div className="commit-list">
                {commits.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#8b949e",
                      padding: "20px",
                    }}
                  >
                    No commits yet.
                  </p>
                ) : (
                  commits
                    .slice()
                    .reverse()
                    .map((commit, index) => (
                      <div key={index} className="commit-item">
                        <div className="commit-icon">
                          <GitCommitIcon size={16} />
                        </div>
                        <div className="commit-content">
                          <p className="commit-message">{commit.message}</p>
                          <span className="commit-date">
                            Committed on{" "}
                            {new Date(commit.date).toLocaleDateString()} at{" "}
                            {new Date(commit.date).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}

            {activeTab === "issues" && (
              <div>
                <div className="issue-create-box">
                  <input
                    className="issue-input"
                    placeholder="Title"
                    value={newIssueTitle}
                    onChange={(e) => setNewIssueTitle(e.target.value)}
                  />
                  <textarea
                    className="issue-input"
                    placeholder="Description"
                    value={newIssueDesc}
                    onChange={(e) => setNewIssueDesc(e.target.value)}
                  />
                  <Button variant="primary" onClick={handleCreateIssue}>
                    Submit Issue
                  </Button>
                </div>
                <div className="issue-list">
                  {issues.map((issue) => (
                    <div
                      key={issue._id}
                      className="issue-card"
                      onClick={() => navigate(`/repo/${id}/issue/${issue._id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <h4>
                        {issue.title}{" "}
                        <span className={`status-${issue.status}`}>
                          ({issue.status})
                        </span>
                      </h4>
                      <p>{issue.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RepoDetails;
