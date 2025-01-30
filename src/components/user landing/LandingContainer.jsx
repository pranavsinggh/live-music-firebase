import React from "react";
import LandingSidebar from "./LandingSidebar";
import LandingContent from "./LandingContent";

const LandingContainer = () => {
  return (
    <section className="bg-slate-700">
      <article className="flex">
        <LandingSidebar />
        <LandingContent />
      </article>
    </section>
  );
};

export default LandingContainer;
