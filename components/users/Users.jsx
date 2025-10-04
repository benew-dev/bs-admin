/* eslint-disable react/prop-types */
"use client";

import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";

import { memo, useContext, useEffect, useState } from "react";
const CustomPagination = dynamic(
  () => import("@/components/layouts/CustomPagniation"),
);
import AuthContext from "@/context/AuthContext";

const UsersTable = dynamic(() => import("./table/UsersTable"), {
  loading: () => <Loading />,
});

import Search from "../layouts/Search";
import { toast } from "react-toastify";

const UserRegistrationStats = dynamic(
  () => import("./card/UserRegistrationStats"),
  {
    loading: () => <Loading />,
  },
);

const Users = memo(({ data }) => {
  const { error, deleteUser, loading, setLoading, clearErrors } =
    useContext(AuthContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const deleteHandler = (id) => {
    deleteUser(id);
  };

  return (
    <div className="relative overflow-x-auto">
      {/* Header amélioré avec gradient */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-t-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Gestion des Utilisateurs
            </h1>
            <p className="text-teal-100 text-sm">
              Gérez et suivez tous les utilisateurs de votre plateforme
            </p>
          </div>
          <div className="flex gap-3">
            <button
              title="Afficher les statistiques"
              onClick={() => setOpen((prev) => !prev)}
              className="px-4 py-2.5 bg-white text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <i className="fa fa-chart-simple" aria-hidden="true"></i>
              <span className="hidden sm:inline">Stats</span>
            </button>
            <Search setLoading={setLoading} />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`${!open && "hidden"} mb-6`}>
        <UserRegistrationStats
          open={open}
          totalUsers={data?.usersCount}
          totalClientUsers={data?.clientUsersCount}
          totalUsersRegisteredThisMonth={data?.usersRegisteredThisMonth}
          totalUsersRegisteredLastMonth={data?.usersRegisteredLastMonth}
        />
      </div>

      {/* Table Section avec design amélioré */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-8">
            <Loading />
          </div>
        ) : (
          <UsersTable users={data?.users} deleteHandler={deleteHandler} />
        )}
      </div>

      {/* Pagination avec design amélioré */}
      {data?.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <CustomPagination totalPages={data?.totalPages} />
        </div>
      )}
    </div>
  );
});

Users.displayName = "Users";

export default Users;
