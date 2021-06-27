import { useState, useEffect } from "react";
import axios from "axios";

function TimelineAPI(token) {
  const [timeline, setTimeline] = useState([]);
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    if (token) {
      const getTimeline = async () => {
        try {
          const res = await axios.get("/post/timeline/all", {
            headers: { Authorization: token },
          });
          setTimeline(res.data);
        } catch (err) {
          alert(err.response.data.msg);
        }
      };
      getTimeline();
    }
  }, [callback, token]);

  const likePost = (postId, profileId) => {
    const currentPost = timeline.filter((p) => p._id === postId)[0];
    if (currentPost.likes.includes(profileId)) {
      currentPost.likes.filter((id) => id !== profileId);
    } else {
      currentPost.likes.push(profileId);
    }
  };

  return {
    timeline: [timeline, setTimeline],
    callback: [callback, setCallback],
    likePost: likePost,
  };
}

export default TimelineAPI;
