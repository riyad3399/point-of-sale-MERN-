


import { useState } from "react";
import TenantUserList from "../components/tenantUser/TenantUserList";
import CreateTenantUser from "../components/tenantUser/CreateTenantUser";
import TenantUserRoleAndPermissions from "../components/tenantUser/TenantUserRoleAndPermissions";

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState("list"); // default tab

  return (
    <div className="p-2">
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "list" ? "border-b-2 border-blue-600" : ""
          }`}
        >
          Users List
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "create" ? "border-b-2 border-blue-600" : ""
          }`}
        >
          Create User
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "roles" ? "border-b-2 border-blue-600" : ""
          }`}
        >
          Roles / Permissions
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "list" && <TenantUserList />}
        {activeTab === "create" && <CreateTenantUser />}
        {activeTab === "roles" && <TenantUserRoleAndPermissions/>}
      </div>
    </div>
  );
}
