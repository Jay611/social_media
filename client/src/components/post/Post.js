import { MoreVert } from "@material-ui/icons";
import "./post.css";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { GlobalState } from "../../GlobalState";
import { format } from "timeago.js";
import { Link } from "react-router-dom";

export default function Post({ post }) {
  const S3 = process.env.REACT_APP_S3;
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [profile] = state.userAPI.profile;
  const likePost = state.timelineAPI.likePost;

  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);

  const [user, setUser] = useState({});

  useEffect(() => {
    setIsLiked(post.likes.includes(profile._id));
  }, [profile._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
        const res = await axios.get(`/user/info?userId=${post.userId}`, {
          headers: { Authorization: token },
        });
        setUser(res.data);
    };
    fetchUser();
  }, [post.userId, token]);

  const likeHandler = () => {
    axios.get(`/post/${post._id}/like`, {
      headers: { Authorization: token },
    });
    setLike(isLiked ? like - 1 : like + 1);
    likePost(post._id, profile._id);
    setIsLiked(!isLiked);
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                src={
                  user.profilePicture
                    ? S3 + user.profilePicture
                    : S3 + "person/noAvatar.png"
                }
                alt=""
                className="postProfileImg"
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img src={`${S3}post/${post.img}`} alt="" className="postImg" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              src={`${S3}assets/like.png`}
              alt=""
              className="likeIcon"
              onClick={likeHandler}
            />
            <img
              src={`${S3}assets/heart.png`}
              alt=""
              className="likeIcon"
              onClick={likeHandler}
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
