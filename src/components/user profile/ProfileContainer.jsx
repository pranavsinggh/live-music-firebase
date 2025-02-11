import React from "react";
import ProfileSidebar from "./ProfileSidebar";
import ProfileContent from "./ProfileContent";

const ProfileContainer = () => {
  return (
    <section>
      <article className="flex">
        <ProfileSidebar />
        <ProfileContent />
      </article>
    </section>
  );
};

export default ProfileContainer;
