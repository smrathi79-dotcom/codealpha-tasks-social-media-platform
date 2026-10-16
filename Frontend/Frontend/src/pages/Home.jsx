import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [view, setView] = useState("home"); // home, profile, chats, videos, groups, settings, notifications, userProfileView
  const [darkMode, setDarkMode] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);

  // Profile State
  const [profileName, setProfileName] = useState(user?.username || "Muthurathi");
  const [profileBio, setProfileBio] = useState("Full-stack MERN Developer building an amazing Social Media App! 🚀");
  const [profileCity, setProfileCity] = useState("Chennai, India");
  const [isEditing, setIsEditing] = useState(false);

  // Dynamic Friends List State
  const [friendsList, setFriendsList] = useState(["Sarah Williams", "David Miller", "John Doe", "Alex Vance"]);

  // Notifications & Friend Requests State
  const [notifications, setNotifications] = useState([
    { id: 1, type: "request", text: "Rahul Kumar sent you a friend request.", sender: "Rahul Kumar", status: "pending" },
    { id: 2, type: "request", text: "Priya Sharma sent you a friend request.", sender: "Priya Sharma", status: "pending" },
    { id: 3, type: "news", text: "🔥 Hot News: React 19 & Vite build speed benchmark released!", time: "10 mins ago" },
    { id: 4, type: "news", text: "🚀 Tech Alert: Node.js 22 LTS features performance boosts.", time: "1 hour ago" }
  ]);

  // Share Modal & Direct Chat Confirmation State
  const [shareModalPost, setShareModalPost] = useState(null);
  const [selectedShareFriend, setSelectedShareFriend] = useState(null);

  // Share Box Features Modals (Photos, Tag, Location)
  const [activeMediaModal, setActiveMediaModal] = useState(null); // 'photo', 'tag', 'location'
  const [postInputText, setPostInputText] = useState("");
  const [attachedImage, setAttachedImage] = useState("");
  const [taggedFriend, setTaggedFriend] = useState("");
  const [postLocation, setPostLocation] = useState("");

  // Follow Suggestions List
  const [suggestions, setSuggestions] = useState([
    { id: 1, name: "Sarah Williams", mutual: "5 mutual friends", followed: false, city: "Bangalore, India", bio: "UI/UX Designer & Tech Enthusiast 🎨", posts: ["Design systems are awesome! ✨"] },
    { id: 2, name: "David Miller", mutual: "2 mutual friends", followed: false, city: "Mumbai, India", bio: "Cloud & DevOps Engineer ☁️", posts: ["Dockerizing React apps successfully! 🐳"] }
  ]);

  // Feed Posts State
  const [posts, setPosts] = useState([
    { 
      id: 1, 
      name: "Muthurathi", 
      time: "5 mins ago", 
      desc: "Our full-stack MERN SocialApp project is up and running perfectly! 🚀🔥", 
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60",
      location: "Chennai, India",
      likes: 32, 
      commentsList: ["Super project, Muthu!", "Amazing UI layout!"], 
      liked: false, 
      saved: false, 
      reposts: 4, 
      views: 128, 
      showComments: false,
      newCommentText: ""
    },
    { 
      id: 2, 
      name: "John Doe", 
      time: "2 hours ago", 
      desc: "Had a great coding session today building interactive React components. 💪", 
      img: "",
      location: "",
      likes: 45, 
      commentsList: ["Keep it up!", "Great explanation."], 
      liked: false, 
      saved: false, 
      reposts: 7, 
      views: 215, 
      showComments: false,
      newCommentText: ""
    }
  ]);

  // Group Community State
  const [activeGroup, setActiveGroup] = useState(null);
  const [groupPosts] = useState({
    "MERN Developers India": [
      { id: 101, author: "Rahul Kumar", time: "10 mins ago", text: "What is the best way to handle JWT tokens in Vite React apps?" }
    ],
    "React & Vite Enthusiasts": [
      { id: 201, author: "Vikram Tech", time: "30 mins ago", text: "Vite HMR speed is absolute magic compared to old webpack! ⚡" }
    ]
  });

  // Separate Dynamic Chat Messages per Friend
  const [activeChat, setActiveChat] = useState("John Doe");
  const [chatHistories, setChatHistories] = useState({
    "John Doe": [{ sender: "John Doe", text: "Hey Muthu, how is the project going?" }],
    "Alex Vance": [{ sender: "Alex Vance", text: "Merged the branch into main!" }]
  });
  const [newMessage, setNewMessage] = useState("");

  // Create Post Handler (Fully Functional)
  const handleCreatePost = () => {
    if (!postInputText.trim() && !attachedImage) {
      alert("Please write something or attach an image to post!");
      return;
    }
    const newP = {
      id: Date.now(),
      name: profileName,
      time: "Just now",
      desc: postInputText + (taggedFriend ? ` (with @${taggedFriend})` : ""),
      img: attachedImage,
      location: postLocation,
      likes: 0,
      commentsList: [],
      liked: false,
      saved: false,
      reposts: 0,
      views: 1,
      showComments: false,
      newCommentText: ""
    };
    setPosts([newP, ...posts]);
    setPostInputText("");
    setAttachedImage("");
    setTaggedFriend("");
    setPostLocation("");
    alert("New Post published successfully! 🎉");
  };

  // Post Actions Handlers
  const handleLike = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked } : p));
  };

  const handleSave = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, saved: !p.saved } : p));
  };

  const toggleComments = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, showComments: !p.showComments } : p));
  };

  const handleAddComment = (id, e) => {
    e.preventDefault();
    setPosts(posts.map(p => {
      if (p.id === id && p.newCommentText.trim()) {
        return {
          ...p,
          commentsList: [...p.commentsList, p.newCommentText],
          newCommentText: ""
        };
      }
      return p;
    }));
  };

  const handleCommentInput = (id, val) => {
    setPosts(posts.map(p => p.id === id ? { ...p, newCommentText: val } : p));
  };

  const handleRepost = (id) => {
    const postToRepost = posts.find(p => p.id === id);
    if (!postToRepost) return;

    const repostedEntry = {
      ...postToRepost,
      id: Date.now(),
      name: `${profileName} (Reposted)`,
      time: "Just now",
      reposts: postToRepost.reposts + 1
    };

    setPosts([repostedEntry, ...posts.map(p => p.id === id ? { ...p, reposts: p.reposts + 1 } : p)]);
    alert("Post reposted onto your timeline feed successfully! 🔄");
  };

  // Direct Chat Sharing Handler
  const confirmShareToFriend = () => {
    if (!selectedShareFriend || !shareModalPost) return;
    
    const sharedMsgText = `📍 [Shared Post]: "${shareModalPost.desc}" by ${shareModalPost.name}`;
    setChatHistories({
      ...chatHistories,
      [selectedShareFriend]: [...(chatHistories[selectedShareFriend] || []), { sender: "You", text: sharedMsgText }]
    });

    alert(`Post shared directly into ${selectedShareFriend}'s chat box! 💬`);
    setShareModalPost(null);
    setSelectedShareFriend(null);
  };

  // Accept Friend Request Handler
  const handleAcceptRequest = (notifId, senderName) => {
    setNotifications(notifications.map(n => n.id === notifId ? { ...n, status: "accepted" } : n));
    if (!friendsList.includes(senderName)) {
      setFriendsList([...friendsList, senderName]);
    }
  };

  const handleFollow = (id) => {
    setSuggestions(suggestions.map(s => s.id === id ? { ...s, followed: !s.followed } : s));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatHistories({
      ...chatHistories,
      [activeChat]: [...(chatHistories[activeChat] || []), { sender: "You", text: newMessage }]
    });
    setNewMessage("");
  };

  const openFriendChat = (friendName) => {
    if (!chatHistories[friendName]) {
      setChatHistories({ ...chatHistories, [friendName]: [] });
    }
    setActiveChat(friendName);
    setView("chats");
  };

  // Dynamic Theme Colors
  const theme = {
    bg: darkMode ? "#18191a" : "#f0f2f5",
    cardBg: darkMode ? "#242526" : "#ffffff",
    text: darkMode ? "#e4e6eb" : "#050505",
    subText: darkMode ? "#b0b3b8" : "#65676b",
    border: darkMode ? "#3e4042" : "#e4e6eb",
    navBg: darkMode ? "#242526" : "#1775ee"
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: "100vh", fontFamily: "sans-serif", transition: "all 0.3s ease" }}>
      
      {/* Topbar */}
      <div style={{ height: "50px", backgroundColor: theme.navBg, display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 999, padding: "0 20px", justifyContent: "space-between", borderBottom: `1px solid ${theme.border}` }}>
        <div onClick={() => setView("home")} style={{ color: "white", fontSize: "24px", fontWeight: "bold", cursor: "pointer" }}>SocialApp</div>
        <input placeholder="Search for friends, post or video" style={{ width: "30%", height: "30px", borderRadius: "20px", border: "none", paddingLeft: "15px", outline: "none", backgroundColor: darkMode ? "#3a3b3c" : "#fff", color: theme.text }} />
        
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          
          {/* Notification Page Icon */}
          <div onClick={() => setView("notifications")} style={{ cursor: "pointer", fontSize: "20px", background: "rgba(255,255,255,0.2)", padding: "5px 8px", borderRadius: "50%", position: "relative" }} title="Notifications">
            🔔
            {notifications.filter(n => n.status === "pending").length > 0 && (
              <span style={{ position: "absolute", top: "-2px", right: "-2px", backgroundColor: "crimson", color: "white", borderRadius: "50%", padding: "2px 5px", fontSize: "10px", fontWeight: "bold" }}>
                {notifications.filter(n => n.status === "pending").length}
              </span>
            )}
          </div>

          {/* Dark Mode Icon Only */}
          <button onClick={() => setDarkMode(!darkMode)} title="Toggle Dark Mode" style={{ backgroundColor: "rgba(255,255,255,0.2)", border: "none", color: "white", width: "35px", height: "35px", borderRadius: "50%", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {darkMode ? "☀️" : "🌙"}
          </button>

          <span style={{ color: "white", fontWeight: "bold", cursor: "pointer" }} onClick={() => setView("profile")}>👤 {profileName}</span>
          <span style={{ color: "white", cursor: "pointer", fontSize: "18px" }} onClick={() => setView("settings")}>⚙️</span>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: "flex", width: "100%", padding: "20px" }}>
        
        {/* Left Sidebar */}
        <div style={{ flex: 2.5, height: "calc(100vh - 70px)", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div onClick={() => setView("home")} style={{ padding: "12px", backgroundColor: view === "home" ? (darkMode ? "#3a3b3c" : "#e4e6eb") : theme.cardBg, borderRadius: "8px", cursor: "pointer", fontWeight: view === "home" ? "bold" : "normal" }}>📰 Feed (Home)</div>
          <div onClick={() => setView("notifications")} style={{ padding: "12px", backgroundColor: view === "notifications" ? (darkMode ? "#3a3b3c" : "#e4e6eb") : theme.cardBg, borderRadius: "8px", cursor: "pointer", fontWeight: view === "notifications" ? "bold" : "normal" }}>🔔 Notifications & Requests</div>
          <div onClick={() => setView("profile")} style={{ padding: "12px", backgroundColor: view === "profile" ? (darkMode ? "#3a3b3c" : "#e4e6eb") : theme.cardBg, borderRadius: "8px", cursor: "pointer", fontWeight: view === "profile" ? "bold" : "normal" }}>👤 My Profile & Details</div>
          <div onClick={() => setView("chats")} style={{ padding: "12px", backgroundColor: view === "chats" ? (darkMode ? "#3a3b3c" : "#e4e6eb") : theme.cardBg, borderRadius: "8px", cursor: "pointer", fontWeight: view === "chats" ? "bold" : "normal" }}>💬 Chats & Direct Messages</div>
          <div onClick={() => setView("videos")} style={{ padding: "12px", backgroundColor: view === "videos" ? (darkMode ? "#3a3b3c" : "#e4e6eb") : theme.cardBg, borderRadius: "8px", cursor: "pointer", fontWeight: view === "videos" ? "bold" : "normal" }}>🎥 Videos & Reels</div>
          <div onClick={() => setView("groups")} style={{ padding: "12px", backgroundColor: view === "groups" ? (darkMode ? "#3a3b3c" : "#e4e6eb") : theme.cardBg, borderRadius: "8px", cursor: "pointer", fontWeight: view === "groups" ? "bold" : "normal" }}>👥 Groups & Communities</div>
          <div onClick={() => setView("settings")} style={{ padding: "12px", backgroundColor: view === "settings" ? (darkMode ? "#3a3b3c" : "#e4e6eb") : theme.cardBg, borderRadius: "8px", cursor: "pointer", fontWeight: view === "settings" ? "bold" : "normal" }}>⚙️ Settings (Saved/Liked)</div>
        </div>

        {/* Center Section */}
        <div style={{ flex: 6, padding: "0 20px", height: "calc(100vh - 70px)", overflowY: "auto" }}>
          
          {/* 1. HOME FEED VIEW */}
          {view === "home" && (
            <>
              {/* Interactive Share / Post Box */}
              <div style={{ backgroundColor: theme.cardBg, borderRadius: "10px", padding: "15px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
                <input 
                  placeholder={`What's on your mind, ${profileName}?`} 
                  value={postInputText} 
                  onChange={(e) => setPostInputText(e.target.value)} 
                  style={{ width: "100%", height: "40px", border: "none", outline: "none", fontSize: "16px", backgroundColor: "transparent", color: theme.text }} 
                />

                {/* Attached Badges Display */}
                {(attachedImage || taggedFriend || postLocation) && (
                  <div style={{ display: "flex", gap: "10px", margin: "10px 0", flexWrap: "wrap", fontSize: "12px" }}>
                    {attachedImage && <span style={{ backgroundColor: "#1775ee", color: "white", padding: "4px 8px", borderRadius: "4px" }}>🖼️ Image Attached</span>}
                    {taggedFriend && <span style={{ backgroundColor: "#42b72a", color: "white", padding: "4px 8px", borderRadius: "4px" }}>🏷️ Tagged: @{taggedFriend}</span>}
                    {postLocation && <span style={{ backgroundColor: "#ff9800", color: "white", padding: "4px 8px", borderRadius: "4px" }}>📍 {postLocation}</span>}
                  </div>
                )}

                <hr style={{ margin: "15px 0", borderColor: theme.border }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "15px", cursor: "pointer", fontSize: "14px", color: theme.subText }}>
                    <span onClick={() => setActiveMediaModal("photo")}>🖼️ Photo/Video</span>
                    <span onClick={() => setActiveMediaModal("tag")}>🏷️ Tag</span>
                    <span onClick={() => setActiveMediaModal("location")}>📍 Location</span>
                  </div>
                  <button onClick={handleCreatePost} style={{ backgroundColor: "#42b72a", color: "white", border: "none", padding: "7px 15px", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}>Share</button>
                </div>
              </div>

              {/* POST BOX FEATURE MODALS */}
              {activeMediaModal && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
                  <div style={{ backgroundColor: theme.cardBg, padding: "20px", borderRadius: "10px", width: "320px", boxShadow: "0px 4px 15px rgba(0,0,0,0.3)" }}>
                    {activeMediaModal === "photo" && (
                      <>
                        <h4 style={{ marginTop: 0 }}>Attach Image URL</h4>
                        <input placeholder="Paste Image URL..." value={attachedImage} onChange={(e) => setAttachedImage(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "5px", border: `1px solid ${theme.border}`, marginBottom: "15px", backgroundColor: "transparent", color: theme.text, outline: "none" }} />
                      </>
                    )}
                    {activeMediaModal === "tag" && (
                      <>
                        <h4 style={{ marginTop: 0 }}>Tag a Friend</h4>
                        <select onChange={(e) => setTaggedFriend(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "5px", border: `1px solid ${theme.border}`, marginBottom: "15px", backgroundColor: theme.cardBg, color: theme.text }}>
                          <option value="">Select Friend...</option>
                          {friendsList.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </>
                    )}
                    {activeMediaModal === "location" && (
                      <>
                        <h4 style={{ marginTop: 0 }}>Add Location</h4>
                        <input placeholder="Enter City/Place..." value={postLocation} onChange={(e) => setPostLocation(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "5px", border: `1px solid ${theme.border}`, marginBottom: "15px", backgroundColor: "transparent", color: theme.text, outline: "none" }} />
                      </>
                    )}
                    <button onClick={() => setActiveMediaModal(null)} style={{ backgroundColor: "#1775ee", color: "white", border: "none", width: "100%", padding: "8px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Done</button>
                  </div>
                </div>
              )}

              {/* Feed Posts List */}
              {posts.map((p) => (
                <div key={p.id} style={{ backgroundColor: theme.cardBg, borderRadius: "10px", padding: "15px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#1775ee", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{p.name[0]}</div>
                      <div>
                        <span style={{ fontWeight: "bold" }}>{p.name}</span>
                        {p.location && <span style={{ fontSize: "12px", color: "#ff9800", marginLeft: "8px" }}>📍 {p.location}</span>}
                        <div style={{ fontSize: "12px", color: theme.subText }}>{p.time}</div>
                      </div>
                    </div>
                    {/* Save/Bookmark Option */}
                    <button onClick={() => handleSave(p.id)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "18px" }} title="Save Post">
                      {p.saved ? "🔖 Saved" : "📑 Save"}
                    </button>
                  </div>

                  <p style={{ margin: "10px 0" }}>{p.desc}</p>
                  {p.img && <img src={p.img} alt="Post Content" style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }} />}

                  {/* Metrics Summary */}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: theme.subText, margin: "10px 0" }}>
                    <span>👍 {p.likes} Likes</span>
                    <span>💬 {p.commentsList.length} Comments • 🔄 {p.reposts} Reposts • 👁️ {p.views} Views</span>
                  </div>

                  {/* Actions Bar */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", borderTop: `1px solid ${theme.border}`, paddingTop: "10px" }}>
                    <button onClick={() => handleLike(p.id)} style={{ border: "none", background: "none", cursor: "pointer", fontWeight: "bold", color: p.liked ? "#1775ee" : theme.subText }}>
                      👍 {p.liked ? "Liked" : "Like"}
                    </button>
                    <button onClick={() => toggleComments(p.id)} style={{ border: "none", background: "none", cursor: "pointer", fontWeight: "bold", color: theme.subText }}>
                      💬 Comment
                    </button>
                    <button onClick={() => setShareModalPost(p)} style={{ border: "none", background: "none", cursor: "pointer", fontWeight: "bold", color: theme.subText }}>
                      ↗️ Share
                    </button>
                    <button onClick={() => handleRepost(p.id)} style={{ border: "none", background: "none", cursor: "pointer", fontWeight: "bold", color: theme.subText }}>
                      🔄 Repost
                    </button>
                    <span style={{ fontSize: "13px", color: theme.subText }}>👁️ {p.views}</span>
                  </div>

                  {/* Expandable Comments */}
                  {p.showComments && (
                    <div style={{ marginTop: "15px", borderTop: `1px dashed ${theme.border}`, paddingTop: "10px" }}>
                      {p.commentsList.map((c, i) => (
                        <div key={i} style={{ backgroundColor: darkMode ? "#3a3b3c" : "#f0f2f5", padding: "6px 10px", borderRadius: "6px", fontSize: "13px", marginBottom: "5px" }}>
                          {c}
                        </div>
                      ))}
                      <form onSubmit={(e) => handleAddComment(p.id, e)} style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                        <input placeholder="Write a comment..." value={p.newCommentText} onChange={(e) => handleCommentInput(p.id, e.target.value)} style={{ flex: 1, height: "30px", borderRadius: "4px", border: `1px solid ${theme.border}`, paddingLeft: "8px", backgroundColor: "transparent", color: theme.text, outline: "none" }} />
                        <button type="submit" style={{ backgroundColor: "#1775ee", color: "white", border: "none", padding: "0 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>Post</button>
                      </form>
                    </div>
                  )}

                </div>
              ))}
            </>
          )}

          {/* SHARE WITH CHAT CONFIRMATION MODAL */}
          {shareModalPost && (
            <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
              <div style={{ backgroundColor: theme.cardBg, padding: "20px", borderRadius: "10px", width: "350px", boxShadow: "0px 4px 15px rgba(0,0,0,0.3)" }}>
                <h3 style={{ margin: "0 0 15px 0" }}>Share Post via Direct Message</h3>
                <p style={{ fontSize: "13px", color: theme.subText, marginBottom: "15px" }}>"{shareModalPost.desc}"</p>
                
                <label style={{ fontSize: "14px", fontWeight: "bold" }}>Select Friend to Send:</label>
                <select onChange={(e) => setSelectedShareFriend(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "5px", border: `1px solid ${theme.border}`, margin: "10px 0 15px 0", backgroundColor: theme.cardBg, color: theme.text }}>
                  <option value="">Choose Friend...</option>
                  {friendsList.map(f => <option key={f} value={f}>{f}</option>)}
                </select>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={confirmShareToFriend} disabled={!selectedShareFriend} style={{ flex: 1, backgroundColor: "#1775ee", color: "white", border: "none", padding: "8px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                    Send Message 💬
                  </button>
                  <button onClick={() => { setShareModalPost(null); setSelectedShareFriend(null); }} style={{ backgroundColor: "crimson", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. DEDICATED NOTIFICATIONS & REQUESTS PAGE */}
          {view === "notifications" && (
            <div style={{ backgroundColor: theme.cardBg, borderRadius: "10px", padding: "20px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
              <h3>Notifications & Requests 🔔</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" }}>
                {notifications.map((n) => (
                  <div key={n.id} style={{ backgroundColor: darkMode ? "#3a3b3c" : "#f9f9f9", padding: "12px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ margin: "0", fontWeight: "bold" }}>{n.text}</p>
                      {n.time && <span style={{ fontSize: "11px", color: theme.subText }}>{n.time}</span>}
                    </div>
                    {n.type === "request" && (
                      <div>
                        {n.status === "pending" ? (
                          <button onClick={() => handleAcceptRequest(n.id, n.sender)} style={{ backgroundColor: "#42b72a", color: "white", border: "none", padding: "6px 12px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                            Accept Request
                          </button>
                        ) : (
                          <span style={{ color: "limegreen", fontWeight: "bold", fontSize: "13px" }}>✓ Friends</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. SETTINGS VIEW (Includes Collections) */}
          {view === "settings" && (
            <div style={{ backgroundColor: theme.cardBg, borderRadius: "10px", padding: "20px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
              <h3>Settings & Collections ⚙️</h3>
              
              <div style={{ margin: "20px 0" }}>
                <h4>🔖 Saved Posts Collection ({posts.filter(p => p.saved).length})</h4>
                {posts.filter(p => p.saved).length === 0 ? <p style={{ color: theme.subText }}>No saved posts yet. Click Save on any feed post!</p> : null}
                {posts.filter(p => p.saved).map(p => (
                  <div key={p.id} style={{ backgroundColor: darkMode ? "#3a3b3c" : "#f9f9f9", padding: "10px", borderRadius: "6px", marginBottom: "8px", borderLeft: "4px solid #1775ee" }}>
                    <strong>{p.name}:</strong> {p.desc}
                  </div>
                ))}
              </div>

              <div style={{ margin: "20px 0" }}>
                <h4>❤️ Liked Posts Collection ({posts.filter(p => p.liked).length})</h4>
                {posts.filter(p => p.liked).length === 0 ? <p style={{ color: theme.subText }}>No liked posts yet.</p> : null}
                {posts.filter(p => p.liked).map(p => (
                  <div key={p.id} style={{ backgroundColor: darkMode ? "#3a3b3c" : "#f9f9f9", padding: "10px", borderRadius: "6px", marginBottom: "8px", borderLeft: "4px solid crimson" }}>
                    <strong>{p.name}:</strong> {p.desc}
                  </div>
                ))}
              </div>

              <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ backgroundColor: "crimson", color: "white", border: "none", padding: "10px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                Log Out / Clear Session
              </button>
            </div>
          )}

          {/* 4. MY PROFILE VIEW */}
          {view === "profile" && (
            <div style={{ backgroundColor: theme.cardBg, borderRadius: "10px", padding: "20px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#1775ee", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", fontWeight: "bold" }}>
                  {profileName[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: "0 0 5px 0" }}>{profileName}</h2>
                  <p style={{ margin: "0", color: theme.subText }}>{user?.email || "muthu@gmail.com"}</p>
                </div>
                <button onClick={() => setIsEditing(!isEditing)} style={{ backgroundColor: "#1775ee", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                  {isEditing ? "Save Profile" : "Edit Profile"}
                </button>
              </div>

              {isEditing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", backgroundColor: darkMode ? "#3a3b3c" : "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
                  <h4>Edit Your Details</h4>
                  <label>Name:</label>
                  <input value={profileName} onChange={(e) => setProfileName(e.target.value)} style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
                  <label>City:</label>
                  <input value={profileCity} onChange={(e) => setProfileCity(e.target.value)} style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
                  <label>Bio:</label>
                  <textarea value={profileBio} onChange={(e) => setProfileBio(e.target.value)} style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
                </div>
              ) : (
                <>
                  <hr style={{ margin: "20px 0", borderColor: theme.border }} />
                  <h3>User Details</h3>
                  <p><strong>City:</strong> {profileCity}</p>
                  <p><strong>Bio:</strong> {profileBio}</p>
                </>
              )}
            </div>
          )}

          {/* 5. CHATS VIEW */}
          {view === "chats" && (
            <div style={{ display: "flex", height: "75vh", backgroundColor: theme.cardBg, borderRadius: "10px", overflow: "hidden", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
              <div style={{ flex: 4, borderRight: `1px solid ${theme.border}`, padding: "10px" }}>
                <h4>Direct Messages</h4>
                {friendsList.map((fname) => (
                  <div key={fname} onClick={() => setActiveChat(fname)} style={{ padding: "12px", backgroundColor: activeChat === fname ? (darkMode ? "#3a3b3c" : "#e4e6eb") : "transparent", borderRadius: "6px", cursor: "pointer", fontWeight: activeChat === fname ? "bold" : "normal", marginBottom: "5px" }}>
                    💬 {fname}
                  </div>
                ))}
              </div>
              
              <div style={{ flex: 8, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "15px" }}>
                <h4 style={{ margin: "0 0 10px 0" }}>Conversation with {activeChat}</h4>
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", padding: "10px" }}>
                  {(chatHistories[activeChat] || []).length === 0 ? (
                    <p style={{ color: theme.subText }}>No prior messages with {activeChat}. Say hi! 👋</p>
                  ) : (
                    chatHistories[activeChat].map((m, idx) => (
                      <div key={idx} style={{ alignSelf: m.sender === "You" ? "flex-end" : "flex-start", backgroundColor: m.sender === "You" ? "#1775ee" : (darkMode ? "#3a3b3c" : "#e4e6eb"), color: m.sender === "You" ? "white" : theme.text, padding: "8px 12px", borderRadius: "10px", maxWidth: "70%" }}>
                        {m.text}
                      </div>
                    ))
                  )}
                </div>
                <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <input placeholder={`Message ${activeChat}...`} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} style={{ flex: 1, height: "35px", borderRadius: "5px", border: `1px solid ${theme.border}`, paddingLeft: "10px", outline: "none", backgroundColor: "transparent", color: theme.text }} />
                  <button type="submit" style={{ backgroundColor: "#1775ee", color: "white", border: "none", padding: "0 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Send</button>
                </form>
              </div>
            </div>
          )}

          {/* 6. GROUPS & COMMUNITY POSTS VIEW */}
          {view === "groups" && (
            <div style={{ backgroundColor: theme.cardBg, borderRadius: "10px", padding: "20px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
              <h3>Communities & Groups 👥</h3>
              <div style={{ display: "flex", gap: "10px", margin: "15px 0" }}>
                {["MERN Developers India", "React & Vite Enthusiasts"].map(gName => (
                  <button key={gName} onClick={() => setActiveGroup(gName)} style={{ backgroundColor: activeGroup === gName ? "#1775ee" : (darkMode ? "#3a3b3c" : "#e4e6eb"), color: activeGroup === gName ? "white" : theme.text, border: "none", padding: "8px 15px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
                    {gName}
                  </button>
                ))}
              </div>

              {activeGroup ? (
                <div style={{ marginTop: "20px" }}>
                  <h4>Group Posts in "{activeGroup}"</h4>
                  {groupPosts[activeGroup]?.map(gp => (
                    <div key={gp.id} style={{ backgroundColor: darkMode ? "#3a3b3c" : "#f9f9f9", padding: "12px", borderRadius: "8px", marginBottom: "10px" }}>
                      <strong style={{ color: "#1775ee" }}>{gp.author}</strong> <span style={{ fontSize: "12px", color: theme.subText }}>• {gp.time}</span>
                      <p style={{ margin: "5px 0 0 0" }}>{gp.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: theme.subText }}>Click on a group button above to view community discussions & posts!</p>
              )}
            </div>
          )}

          {/* 7. VIDEOS VIEW */}
          {view === "videos" && (
            <div style={{ backgroundColor: theme.cardBg, borderRadius: "10px", padding: "20px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
              <h3>Trending Reels & Videos 🎥</h3>
              <div style={{ backgroundColor: "#000", height: "220px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "20px", marginTop: "15px" }}>
                ▶️ MERN Stack Full Course Reel Preview
              </div>
            </div>
          )}

          {/* 8. USER PROFILE VIEW */}
          {view === "userProfileView" && selectedUserProfile && (
            <div style={{ backgroundColor: theme.cardBg, borderRadius: "10px", padding: "20px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
              <button onClick={() => setView("home")} style={{ backgroundColor: "#1775ee", color: "white", border: "none", padding: "6px 12px", borderRadius: "5px", cursor: "pointer", marginBottom: "15px" }}>← Back to Feed</button>
              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#555", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", fontWeight: "bold" }}>
                  {selectedUserProfile.name[0]}
                </div>
                <div>
                  <h2 style={{ margin: "0 0 5px 0" }}>{selectedUserProfile.name}</h2>
                  <p style={{ margin: "0", color: theme.subText }}>📍 {selectedUserProfile.city}</p>
                </div>
              </div>
              <hr style={{ margin: "15px 0", borderColor: theme.border }} />
              <h4>About</h4>
              <p>{selectedUserProfile.bio}</p>
              
              <h4 style={{ marginTop: "25px" }}>Posts by {selectedUserProfile.name}</h4>
              {selectedUserProfile.posts?.map((pst, idx) => (
                <div key={idx} style={{ backgroundColor: darkMode ? "#3a3b3c" : "#f9f9f9", padding: "12px", borderRadius: "8px", marginBottom: "10px", borderLeft: "4px solid #1775ee" }}>
                  <p style={{ margin: "0" }}>{pst}</p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Rightbar */}
        <div style={{ flex: 3.5, height: "calc(100vh - 70px)", overflowY: "auto" }}>
          
          {/* Follow Suggestions */}
          <div style={{ backgroundColor: theme.cardBg, padding: "15px", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)", marginBottom: "15px" }}>
            <h4 style={{ margin: "0 0 10px 0" }}>Suggested For You 🤝</h4>
            {suggestions.map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "12px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => { setSelectedUserProfile(s); setView("userProfileView"); }}>
                  <div style={{ width: "35px", height: "35px", borderRadius: "50%", backgroundColor: "#777", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{s.name[0]}</div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "bold" }}>{s.name}</div>
                    <div style={{ fontSize: "11px", color: theme.subText }}>{s.mutual}</div>
                  </div>
                </div>
                <button onClick={() => handleFollow(s.id)} style={{ backgroundColor: s.followed ? (darkMode ? "#3a3b3c" : "#ddd") : "#1775ee", color: s.followed ? theme.text : "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>
                  {s.followed ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>

          {/* Online Friends */}
          <div style={{ backgroundColor: theme.cardBg, padding: "15px", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
            <h4 style={{ margin: "0 0 10px 0" }}>Online Friends 🟢 ({friendsList.length})</h4>
            {friendsList.map(fname => (
              <div key={fname} onClick={() => openFriendChat(fname)} style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0", cursor: "pointer", padding: "5px", borderRadius: "5px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "limegreen" }}></span>
                <span>{fname}</span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}