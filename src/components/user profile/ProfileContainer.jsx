import React from "react";
import ProfileSidebar from "./ProfileSidebar";
import ProfileContent from "./ProfileContent";

const ProfileContainer = () => {
  return (
    <section>
      <article className="flex gap-2">
        <ProfileSidebar />
        <ProfileContent />
      </article>
    </section>
  );
};

export default ProfileContainer;
