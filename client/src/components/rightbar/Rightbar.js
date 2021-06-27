import "./rightbar.css";
import { Users } from "../../dummydata";
import Online from "../../components/online/Online";
import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { GlobalState } from "../../GlobalState";
import { Link } from "react-router-dom";
import { Add, Remove } from "@material-ui/icons";

export default function Rightbar({ user }) {
  const S3 = process.env.REACT_APP_S3;

  const state = useContext(GlobalState);
  const [token] = state.token;
  const [profile] = state.userAPI.profile;
  const [callback, setCallback] = state.timelineAPI.callback;
  const [friends, setFriends] = useState([]);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    setFollowed(profile?.followings?.includes(user?._id));
  }, [profile, user]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        if (user && user._id) {
          const res = await axios.get(`/user/friends/${user._id}`, {
            headers: { Authorization: token },
          });
          setFriends(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user, token]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(
          "/user/unfollow",
          { userId: user._id },
          { headers: { Authorization: token } }
        );
      } else {
        await axios.put(
          "/user/follow",
          { userId: user._id },
          { headers: { Authorization: token } }
        );
      }
      setFollowed(!followed);
      setCallback(!callback);
    } catch (err) {
      console.log(err);
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img src={`${S3}assets/gift.png`} alt="" className="birthdayImg" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.
          </span>
        </div>
        <img src={`${S3}assets/ad.png`} alt="" className="rightbarAd" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((user) => (
            <Online key={user.id} user={user} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== profile.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user.relationships === 1
                ? "Single"
                : user.relationships === 2
                ? "Married"
                : "-"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              key={friend._id}
              to={`/profile/${friend.username}`}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? S3 + friend.profilePicture
                      : S3 + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
