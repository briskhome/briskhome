import * as React from "react";
import cn from "classnames"; // import './avatar.styl';

type AvatarPropsType = {
  name?: string;
  image?: string;
  online?: boolean;
  className?: string;
};
export const BriskhomeAvatar = ({
  name,
  image,
  online,
  className = ""
}: AvatarPropsType): React.Node => {
  const initials = name ? name.split(" ").map(word => word.length ? word[0] : "").join("").toUpperCase() : "";
  return <div className={cn(className, "briskhome-avatar")}>
      {name && <span className="briskhome-avatar__name">{initials}</span>}
      {image && <img className="briskhome-avatar__image" src={image} alt="" />}
      {online && <div className="briskhome-avatar__online" />}
    </div>;
};
export default BriskhomeAvatar;