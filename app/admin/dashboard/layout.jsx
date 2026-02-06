import React from "react";
import Sidebar from "../sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <main className="pl-[280px] pt-6 pr-6 pb-12 min-h-screen">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
