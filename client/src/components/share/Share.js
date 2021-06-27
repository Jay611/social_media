import "./share.css";
import {
  Cancel,
  EmojiEmotions,
  Label,
  PermMedia,
  Room,
} from "@material-ui/icons";
import { useContext, useRef, useState } from "react";
import { GlobalState } from "../../GlobalState";
import axios from "axios";

export default function Share() {
  const state = useContext(GlobalState);
  const [profile] = state.userAPI.profile;
  const [token] = state.token;

  const S3 = process.env.REACT_APP_S3;

  const desc = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("desc", desc.current.value);
    if (file) {
      data.append("file", file);

      try {
        await axios.post("/post", data, {
          headers: {
            Authorization: token,
            "content-type": "multipart/form-data",
          },
        });
      } catch (err) {
        console.log(err);
      }
    }

    desc.current.value = "";
    window.location.reload();
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            src={
              profile.profilePicture
                ? S3 + profile.profilePicture
                : S3 + "person/noAvatar.png"
            }
            alt=""
            className="shareProfileImg"
          />
          <input
            placeholder={`What's in your mind ${profile.username}?`}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}
