/* eslint-disable react/prop-types */
import React from "react";
import { arrayHasData } from "@/helpers/helpers";
import Link from "next/link";
import Image from "next/image";

const UsersTable = ({ users, deleteHandler }) => {
  // Fonction pour obtenir la couleur du badge de rôle
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700 border-red-200";
      case "user":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return arrayHasData(users) ? (
    <div className="w-full py-16 px-6">
      <div className="max-w-md mx-auto text-center">
        <div className="mx-auto w-24 h-24 mb-6 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-teal-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <h3 className="font-bold text-2xl text-gray-800 mb-3">
          Aucun Utilisateur
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Les utilisateurs inscrits apparaîtront ici.
        </p>
      </div>
    </div>
  ) : (
    <div>
      {/* Header du tableau avec compteur */}
      <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <i className="fa fa-users text-teal-600"></i>
          Liste des Utilisateurs
        </h2>
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 bg-teal-600 text-white font-bold rounded-lg shadow-sm">
            {users?.length || 0}
          </span>
          <span className="text-sm text-gray-600 font-medium">
            Utilisateur{users?.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs font-semibold uppercase bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-b-2 border-gray-300">
            <tr>
              <th scope="col" className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <i className="fa fa-user text-gray-500"></i>
                  Nom
                </div>
              </th>
              <th scope="col" className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <i className="fa fa-envelope text-gray-500"></i>
                  Email
                </div>
              </th>
              <th scope="col" className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <i className="fa fa-phone text-gray-500"></i>
                  Téléphone
                </div>
              </th>
              <th scope="col" className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <i className="fa fa-shield text-gray-500"></i>
                  Rôle
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <i className="fa fa-cog text-gray-500"></i>
                  Actions
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users?.map((user) => (
              <tr
                key={user?._id}
                className="bg-white hover:bg-teal-50 transition-colors duration-150"
              >
                {/* Nom avec avatar */}
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                      <Image
                        src={
                          user?.avatar?.url
                            ? user.avatar.url
                            : "/images/default.png"
                        }
                        alt={user?.name || "User"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-gray-900">
                      {user?.name}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-3">
                  <span className="text-gray-700">{user?.email}</span>
                </td>

                {/* Téléphone */}
                <td className="px-6 py-3">
                  <span className="font-mono text-sm text-gray-700">
                    {user?.phone}
                  </span>
                </td>

                {/* Rôle */}
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user?.role)}`}
                  >
                    <i
                      className={`fa ${user?.role === "admin" ? "fa-crown" : "fa-user"}`}
                    ></i>
                    {user?.role === "admin" ? "Admin" : "Client"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-3">
                  <div className="flex gap-2 justify-center">
                    {/* Voir */}
                    <Link
                      href={`/admin/users/${user?._id}/profile`}
                      className="p-2 inline-flex items-center justify-center text-blue-700 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
                      title="Voir le profil"
                    >
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    </Link>

                    {/* Modifier */}
                    <Link
                      href={`/admin/users/${user?._id}`}
                      className="p-2 inline-flex items-center justify-center text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-lg hover:bg-yellow-200 transition-all duration-200 shadow-sm hover:shadow-md"
                      title="Modifier l'utilisateur"
                    >
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </Link>

                    {/* Supprimer */}
                    <button
                      onClick={() => deleteHandler(user?._id)}
                      className="p-2 inline-flex items-center justify-center text-red-700 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 transition-all duration-200 shadow-sm hover:shadow-md"
                      title="Supprimer l'utilisateur"
                    >
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Résumé en bas de tableau */}
      <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <div className="text-teal-700">
            <i className="fa fa-users mr-2"></i>
            <span className="font-semibold">{users?.length || 0}</span>{" "}
            utilisateur{users?.length > 1 ? "s" : ""} enregistré
            {users?.length > 1 ? "s" : ""}
          </div>
          <div className="text-teal-700">
            <span className="font-medium">
              Admin: {users?.filter((u) => u.role === "admin").length || 0}
            </span>
            <span className="mx-2">•</span>
            <span className="font-medium">
              Clients: {users?.filter((u) => u.role === "user").length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
