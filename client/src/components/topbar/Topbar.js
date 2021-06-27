import { useContext } from "react";
import { Chat, Notifications, Person, Search } from "@material-ui/icons";
import { Link } from "react-router-dom";
import axios from "axios";

import "./topbar.css";
import { GlobalState } from "../../GlobalState";

export default function Topbar() {
  const S3 = process.env.REACT_APP_S3;
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [profile] = state.userAPI.profile;

  const logoutUser = async () => {
    await axios.get("/user/logout");
    localStorage.removeItem("firstLogin");
    window.location.href = "/";
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" className="link">
          <span className="logo">Social</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            className="searchInput"
            placeholder="Search for friend, post or video"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">4</span>
          </div>
        </div>

        <Link to={`/profile/${profile.username}`}>
          <img
            src={
              profile.profilePicture
                ? S3 + profile.profilePicture
                : S3 + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
        <img src={S3 + "person/noAvatar.png"} alt="" className="topbarImg" onClick={logoutUser}/>
      </div>
    </div>
  );
}
