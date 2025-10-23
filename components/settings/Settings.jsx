"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import SettingsContext from "@/context/SettingsContext";

const Settings = ({ dataCategory, dataPayment }) => {
  const {
    setCategories,
    deleteCategory,
    deletePayment,
    toggleCategoryStatus,
    error,
    clearErrors,
  } = useContext(SettingsContext);

  const [loadingStates, setLoadingStates] = useState({
    deletingCategories: new Set(),
    togglingCategories: new Set(),
    deletingPayments: new Set(),
  });

  useEffect(() => {
    setCategories(dataCategory?.categories);
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error, dataCategory, setCategories, clearErrors]);

  const categoryColors = [
    { bg: "from-purple-500 to-purple-600", ring: "ring-purple-300" },
    { bg: "from-pink-500 to-pink-600", ring: "ring-pink-300" },
    { bg: "from-blue-500 to-blue-600", ring: "ring-blue-300" },
    { bg: "from-green-500 to-green-600", ring: "ring-green-300" },
    { bg: "from-orange-500 to-orange-600", ring: "ring-orange-300" },
    { bg: "from-indigo-500 to-indigo-600", ring: "ring-indigo-300" },
  ];

  const platformColors = {
    WAAFI: "from-blue-500 to-blue-600",
    "D-MONEY": "from-purple-500 to-purple-600",
    "CAC-PAY": "from-green-500 to-green-600",
    "BCI-PAY": "from-orange-500 to-orange-600",
    CASH: "from-gray-700 to-gray-900",
  };

  const setLoadingState = (type, id, isLoading) => {
    setLoadingStates((prev) => {
      const newSet = new Set(prev[type]);
      if (isLoading) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return { ...prev, [type]: newSet };
    });
  };

  const isLoading = (type, id) => loadingStates[type].has(id);

  const deletePaymentHandler = async (id) => {
    if (isLoading("deletingPayments", id)) return;
    try {
      setLoadingState("deletingPayments", id, true);
      await deletePayment(id);
    } finally {
      setLoadingState("deletingPayments", id, false);
    }
  };

  const deleteCategoryHandler = async (id) => {
    if (isLoading("deletingCategories", id)) return;
    try {
      setLoadingState("deletingCategories", id, true);
      await deleteCategory(id);
    } finally {
      setLoadingState("deletingCategories", id, false);
    }
  };

  const toggleCategoryStatusHandler = async (id) => {
    if (isLoading("togglingCategories", id)) return;
    try {
      setLoadingState("togglingCategories", id, true);
      await toggleCategoryStatus(id);
    } finally {
      setLoadingState("togglingCategories", id, false);
    }
  };

  const activeCategories =
    dataCategory?.categories?.filter((cat) => cat.isActive) || [];
  const inactiveCategories =
    dataCategory?.categories?.filter((cat) => !cat.isActive) || [];

  // Séparer les moyens de paiement CASH et non-CASH
  const cashPayment = dataPayment?.paymentTypes?.find(
    (p) => p.platform === "CASH" || p.isCashPayment,
  );
  const electronicPayments =
    dataPayment?.paymentTypes?.filter(
      (p) => p.platform !== "CASH" && !p.isCashPayment,
    ) || [];

  const renderCategoryCard = (category, index, isActive) => {
    const isDeleting = isLoading("deletingCategories", category._id);
    const isToggling = isLoading("togglingCategories", category._id);
    const isAnyOperation = isDeleting || isToggling;
    const colorScheme = categoryColors[index % categoryColors.length];

    return (
      <div
        key={category._id}
        className={`relative group rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
          isAnyOperation ? "opacity-50 scale-95" : ""
        }`}
      >
        <div
          className={`p-6 bg-gradient-to-br ${isActive ? colorScheme.bg : "from-gray-400 to-gray-500"}`}
        >
          {/* Loading Overlay */}
          {isAnyOperation && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white text-sm mt-2 font-semibold">
                  {isDeleting ? "Suppression..." : "Mise à jour..."}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-start mb-4">
            <button
              onClick={() => toggleCategoryStatusHandler(category._id)}
              disabled={isAnyOperation}
              className={`p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all ${
                isAnyOperation ? "cursor-not-allowed" : ""
              }`}
              title={isActive ? "Désactiver" : "Activer"}
            >
              {isToggling ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {isActive ? (
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              )}
            </button>
            <button
              onClick={() => deleteCategoryHandler(category._id)}
              disabled={isAnyOperation}
              className={`p-2 rounded-lg bg-red-500/80 backdrop-blur-sm hover:bg-red-600 transition-all ${
                isAnyOperation ? "cursor-not-allowed" : ""
              }`}
              title="Supprimer"
            >
              {isDeleting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Category Name */}
          <h3 className="text-white text-xl font-bold mb-3 truncate">
            {category.categoryName}
          </h3>

          {/* Stats */}
          <div className="flex items-center justify-between mb-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
              <p className="text-white/80 text-xs uppercase">Vendus</p>
              <p className="text-white text-2xl font-bold">
                {category.sold || 0}
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-full font-bold text-sm ${
                isActive
                  ? "bg-green-500 text-white"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              {isActive ? "✓ ACTIF" : "✗ INACTIF"}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Paramètres</h1>
          <p className="text-slate-600">
            Gérez vos catégories et moyens de paiement
          </p>
        </div>

        {/* Categories Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Catégories de Produits
                </h2>
                <p className="text-sm text-slate-500">
                  {activeCategories.length} active
                  {activeCategories.length !== 1 ? "s" : ""} •{" "}
                  {inactiveCategories.length} inactive
                  {inactiveCategories.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <Link
              href="/admin/settings/categories/add"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Ajouter
            </Link>
          </div>

          {/* Active Categories */}
          {activeCategories.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Catégories Actives ({activeCategories.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeCategories.map((category, index) =>
                  renderCategoryCard(category, index, true),
                )}
              </div>
            </div>
          )}

          {/* Inactive Categories */}
          {inactiveCategories.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                Catégories Inactives ({inactiveCategories.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inactiveCategories.map((category, index) =>
                  renderCategoryCard(category, index, false),
                )}
              </div>
            </div>
          )}

          {activeCategories.length === 0 && inactiveCategories.length === 0 && (
            <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
              <svg
                className="w-20 h-20 mx-auto text-slate-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <p className="text-lg font-semibold text-slate-600 mb-2">
                Aucune catégorie
              </p>
              <p className="text-slate-500">
                Commencez par créer votre première catégorie
              </p>
            </div>
          )}
        </div>

        {/* Payment Types Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Moyens de Paiement
                </h2>
                <p className="text-sm text-slate-500">
                  {dataPayment?.paymentTypes?.length || 0} moyen
                  {(dataPayment?.paymentTypes?.length || 0) !== 1
                    ? "s"
                    : ""}{" "}
                  configuré
                  {(dataPayment?.paymentTypes?.length || 0) !== 1 ? "s" : ""}
                  {cashPayment && " • Espèces activées"}
                </p>
              </div>
            </div>
            <Link
              href="/admin/settings/paymentType/add"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Ajouter
            </Link>
          </div>

          {/* Message informatif si CASH est activé */}
          {cashPayment && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-green-800 mb-1">
                    Paiement en espèces activé
                  </p>
                  <p className="text-sm text-green-700">
                    Les clients peuvent maintenant choisir de payer en espèces
                    lors de la récupération de leur commande.
                  </p>
                </div>
              </div>
            </div>
          )}

          {dataPayment?.paymentTypes && dataPayment.paymentTypes.length > 0 ? (
            <div className="space-y-6">
              {/* Section des paiements électroniques */}
              {electronicPayments.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wider">
                    Paiements électroniques ({electronicPayments.length})
                  </h3>
                  <div className="flex flex-col gap-4">
                    {electronicPayments.map((payment) => {
                      const isDeleting = isLoading("deletingPayments", payment._id);
                      const platformColor =
                        platformColors[payment.platform] || "from-emerald-500 to-green-600";

                      return (
                        <div
                          key={payment._id}
                          className={`relative group bg-gradient-to-r ${platformColor} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all ${
                            isDeleting ? "opacity-50 scale-95" : "hover:scale-[1.02]"
                          }`}
                        >
                          {isDeleting && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-white text-xs mt-2">
                                  Suppression...
                                </span>
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => deletePaymentHandler(payment._id)}
                            disabled={isDeleting}
                            className={`absolute top-3 right-3 p-2 rounded-lg bg-red-500/80 backdrop-blur-sm hover:bg-red-600 transition-all ${
                              isDeleting ? "cursor-not-allowed" : ""
                            }`}
                            title="Supprimer"
                          >
                            {isDeleting ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            )}
                          </button>

                          <div className="flex items-center gap-6 text-white pr-12">
                            {/* Icon */}
                            <div className="flex-shrink-0 w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                              <svg
                                className="w-7 h-7"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                <path
                                  fillRule="evenodd"
                                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>

                            {/* Content - Responsive layout */}
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              {/* Left section - Platform name */}
                              <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold">
                                  {payment.platform}
                                </h3>
                                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                                  ✓ ACTIF
                                </span>
                              </div>

                              {/* Right section - Payment details */}
                              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                {/* Account Holder */}
                                <div className="flex items-center gap-2">
                                  <span className="text-white/70 text-xs uppercase">
                                    Titulaire:
                                  </span>
                                  <span className="text-white font-semibold">
                                    {payment.paymentName}
                                  </span>
                                </div>

                                {/* Separator */}
                                <div className="hidden sm:block w-px h-8 bg-white/20"></div>

                                {/* Account Number */}
                                <div className="flex items-center gap-2">
                                  <span className="text-white/70 text-xs uppercase">
                                    N°:
                                  </span>
                                  <span className="text-white/90 font-mono text-sm font-semibold">
                                    {payment.paymentNumber}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section paiement cash (layout horizontal aussi) */}
              {cashPayment && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Paiement en espèces
                  </h3>
                  <div className="flex flex-col gap-4">
                    {(() => {
                      const isDeleting = isLoading("deletingPayments", cashPayment._id);
                      const platformColor = platformColors.CASH;

                      return (
                        <div
                          className={`relative group bg-gradient-to-r ${platformColor} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all ${
                            isDeleting ? "opacity-50 scale-95" : "hover:scale-[1.02]"
                          }`}
                        >
                          {isDeleting && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-white text-xs mt-2">
                                  Suppression...
                                </span>
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => deletePaymentHandler(cashPayment._id)}
                            disabled={isDeleting}
                            className={`absolute top-3 right-3 p-2 rounded-lg bg-red-500/80 backdrop-blur-sm hover:bg-red-600 transition-all ${
                              isDeleting ? "cursor-not-allowed" : ""
                            }`}
                            title="Supprimer"
                          >
                            {isDeleting ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            )}
                          </button>

                          <div className="flex items-center gap-6 text-white pr-12">
                            {/* Icon */}
                            <div className="flex-shrink-0 w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                              <svg
                                className="w-7 h-7"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                            </div>

                            {/* Content - Responsive layout */}
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              {/* Left section - Platform name */}
                              <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold">
                                  {cashPayment.platform}
                                </h3>
                                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                                  ✓ ACTIF
                                </span>
                              </div>

                              {/* Right section - Cash details */}
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-white/90 text-sm font-medium">
                                    {cashPayment.description || "Paiement en espèces"}
                                  </span>
                                  <span className="text-white/70 text-xs px-3 py-1 bg-white/10 rounded-full">
                                    À la livraison
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
              <svg
                className="w-20 h-20 mx-auto text-slate-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <p className="text-lg font-semibold text-slate-600 mb-2">
                Aucun moyen de paiement
              </p>
              <p className="text-slate-500">
                Ajoutez votre premier moyen de paiement
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;