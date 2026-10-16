
import "./profile.css";
import Feed from "../../components/feed/Feed";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState({});
  const username = useParams().username;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users?username=${username}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [username]);

  return (
    <div className="profile">
      <div className="profileRight" style={{ width: "100%" }}>
        <div className="profileRightTop">
          <div className="profileCover">
            <img
              className="profileCoverImg"
              src={user?.coverPicture ? user.coverPicture : "/assets/post/3.jpeg"}
              alt=""
            />
            <img
              className="profileUserImg"
              src={user?.profilePicture ? user.profilePicture : "/assets/person/noAvatar.png"}
              alt=""
            />
          </div>
          <div className="profileInfo">
            <h4 className="profileInfoName">{user?.username}</h4>
            <span className="profileInfoDesc">{user?.desc}</span>
          </div>
        </div>
        <div className="profileRightBottom">
          <Feed username={username} />
        </div>
      </div>
    </div>
  );
}