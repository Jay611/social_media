import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import axios from "axios";
import "./feed.css";

import { GlobalState } from "../../GlobalState";

export default function Feed({ username }) {
  const state = useContext(GlobalState);
  const [posts, setPosts] = useState([]);
  const [profile] = state.userAPI.profile;

  const [timeline] = state.timelineAPI.timeline;

  useEffect(() => {
    const fetchPosts = async () => {
      if (username) {
        const res = await axios.get(`/post/profile/${username}`);
        setPosts(
          res.data.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );
      } else {
        setPosts(
          timeline.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );
      }
    };
    fetchPosts();
  }, [username, timeline]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === profile.username) && <Share />}
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
