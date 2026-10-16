import { useContext, useEffect, useState } from "react";
import Share from "../Share"; // 👈 Single dot (..) pothum, exact path ithu dhan
import Post from "../post/Post";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Backend timeline route-ku request anuppudhu
        const res = await axios.get(`http://localhost:5000/api/posts/timeline/${user._id}`);
        // Date base-la recent posts mela varura maari sort panrom
        setPosts(
          res.data.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, [user._id]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}