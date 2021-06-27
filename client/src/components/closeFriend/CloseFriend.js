import "./closeFriend.css";

export default function CloseFriend({ user }) {
  const S3 = process.env.REACT_APP_S3;

  return (
    <li className="sidebarFriend">
      <img src={S3+user.profilePicture} alt="" className="sidebarFriendImg" />
      <span className="sidebarFriendName">{user.username}</span>
    </li>
  );
}
