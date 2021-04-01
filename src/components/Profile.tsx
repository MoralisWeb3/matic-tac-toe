import Moralis from "moralis";
import React from "react";
import { useUserContext } from "../hooks/Moralis/User";

export const ProfileIcon = () => {
  const [userData] = useUserContext();
  const saveProfileImage = useSaveProfileImage();

  if (!userData) return null;
  return (
    <Avatar>
      <h1>+</h1>
      <ProfileImage />
      <FileInput onChange={saveProfileImage} />
    </Avatar>
  );
};

const useSaveProfileImage = () => {
  const setUser = useUserContext()[1];
  const saveProfileImage = async (ev) => {
    const [fileSrc] = ev.target.files;
    if (!fileSrc) return;

    const file = new Moralis.File(fileSrc.name, fileSrc);
    await file.saveIPFS();

    const user = Moralis.User.current();
    user.set("profileImage", file);
    await user.save();

    setUser(user.attributes);
  };

  return saveProfileImage;
};

const Avatar = ({ children }) => {
  return (
    <div
      style={{
        position: "relative",
        height: 50,
        width: 50,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="rounded-circle bg-white border border-dark text-dark"
    >
      {children}
    </div>
  );
};

const ProfileImage = () => {
  const [userData] = useUserContext();
  const image = userData.profileImage && userData.profileImage.ipfs();
  return image ? (
    <img
      style={{
        objectFit: "cover",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      src={userData.profileImage.ipfs()}
    />
  ) : null;
};

const FileInput = (props) => (
  <input
    type="file"
    style={{
      opacity: 0,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    }}
    {...props}
  />
);
