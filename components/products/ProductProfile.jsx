"use client";

import { useState } from "react";
import Image from "next/image";

const ProductProfile = ({ data }) => {
  const [activeTab, setActiveTab] = useState("infos");
  const [selectedImage, setSelectedImage] = useState(null);
  const product = data?.product;
  const orders = data?.idsOfOrders || [];
  const revenues = data?.revenuesGenerated?.[0]?.details || [];

  // Calculer le total des revenus
  const totalRevenue = revenues.reduce(
    (acc, rev) => acc + (rev?.price || 0),
    0,
  );

  // Formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Formater le prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-DJ", {
      style: "currency",
      currency: "DJF",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-3">
                {product?.name}
              </h1>
              <p className="text-slate-600 text-sm font-mono mb-4">
                ID: {product?._id}
              </p>
              <div className="flex gap-3">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                    product?.isActive
                      ? "bg-green-100 text-green-700 border-2 border-green-200"
                      : "bg-red-100 text-red-700 border-2 border-red-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      product?.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  {product?.isActive ? "Actif" : "Inactif"}
                </span>
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold border-2 border-purple-200">
                  {product?.category?.categoryName || "Sans catégorie"}
                </span>
              </div>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">
                  {product?.stock || 0}
                </div>
                <div className="text-xs text-blue-700 uppercase font-semibold mt-1">
                  En stock
                </div>
              </div>
              <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <div className="text-3xl font-bold text-green-600">
                  {product?.sold || 0}
                </div>
                <div className="text-xs text-green-700 uppercase font-semibold mt-1">
                  Vendus
                </div>
              </div>
              <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">
                  {formatPrice(product?.price || 0)}
                </div>
                <div className="text-xs text-purple-700 uppercase font-semibold mt-1">
                  Prix
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 mb-6 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("infos")}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === "infos"
                  ? "text-blue-600 bg-blue-50 border-b-4 border-blue-600"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Informations
              </div>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === "orders"
                  ? "text-blue-600 bg-blue-50 border-b-4 border-blue-600"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Commandes ({orders.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("revenue")}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === "revenue"
                  ? "text-blue-600 bg-blue-50 border-b-4 border-blue-600"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Revenus ({formatPrice(totalRevenue)})
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Infos Tab */}
            {activeTab === "infos" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Galerie d'images */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Galerie Photos
                  </h3>
                  {product?.images?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {product.images.map((image, index) => (
                        <div
                          key={image._id || index}
                          onClick={() => setSelectedImage(image.url)}
                          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group border-2 border-slate-200 hover:border-purple-400 transition-all"
                        >
                          <Image
                            src={image.url || "/images/default_product.png"}
                            alt={`${product.name} - ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                              />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-slate-300">
                      <svg
                        className="w-16 h-16 mx-auto text-slate-300 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-slate-500 font-medium">
                        Aucune image disponible
                      </p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Description
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    {product?.description}
                  </p>
                </div>

                {/* Métadonnées */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <p className="text-sm text-slate-500 mb-1">Créé le</p>
                    <p className="text-lg font-semibold text-slate-800">
                      {formatDate(product?.createdAt)}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <p className="text-sm text-slate-500 mb-1">Mis à jour le</p>
                    <p className="text-lg font-semibold text-slate-800">
                      {formatDate(product?.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">
                    Commandes incluant ce produit
                  </h3>
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
                    {orders.length} commande{orders.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {orders.length === 0 ? (
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
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <p className="text-lg font-semibold text-slate-600 mb-2">
                      Aucune commande
                    </p>
                    <p className="text-slate-500">
                      Ce produit n'a pas encore été commandé
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                            ID Commande
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                            Statut
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {orders.map((order) => (
                          <tr
                            key={order._id}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-6 py-4 font-mono text-sm text-slate-700">
                              {order._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {order?.details?.date
                                ? formatDate(order.details.date)
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  order?.details?.payment === "paid"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {order?.details?.payment || "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <a
                                href={`/admin/orders/${order._id}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                              >
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
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                                Voir
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Revenue Tab */}
            {activeTab === "revenue" && (
              <div className="animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">
                    Revenus générés
                  </h3>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Total</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatPrice(totalRevenue)}
                    </p>
                  </div>
                </div>

                {revenues.length === 0 ? (
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-lg font-semibold text-slate-600 mb-2">
                      Aucun revenu
                    </p>
                    <p className="text-slate-500">
                      Ce produit n'a pas encore généré de revenus
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                            Quantité
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                            Revenu
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {revenues.map((revenue, index) => (
                          <tr
                            key={index}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                {revenue?.quantity || 0} unité
                                {revenue?.quantity > 1 ? "s" : ""}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-lg font-bold text-green-600">
                                {formatPrice(revenue?.price || 0)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {revenue?.date ? formatDate(revenue.date) : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox pour images */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <svg
              className="w-8 h-8"
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
          </button>
          <img
            src={selectedImage}
            alt="Image agrandie"
            className="max-w-full max-h-[90vh] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductProfile;
