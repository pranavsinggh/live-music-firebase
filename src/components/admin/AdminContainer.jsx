import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminContent from "./AdminContent";

const AdminContainer = () => {
  return (
    <section className="bg-slate-700">
      <article className="flex">
        <AdminSidebar />
        <AdminContent />
      </article>
    </section>
  );
};

export default AdminContainer;
