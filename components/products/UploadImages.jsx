"use client";

import React, { useContext, useState, useEffect, memo } from "react";
import { toast } from "react-toastify";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import ProductContext from "@/context/ProductContext";
import axios from "axios";

const UploadImages = memo(({ id }) => {
  const {
    addProductImages,
    productImages,
    removeProductImage,
    error,
    loading,
    clearErrors,
  } = useContext(ProductContext);

  const [isRemoving, setIsRemoving] = useState({});
  const [uploadConfig, setUploadConfig] = useState(null);

  useEffect(() => {
    const fetchUploadConfig = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cloudinary/sign`,
        );
        setUploadConfig(data);
      } catch (error) {
        console.error("Failed to fetch upload config:", error);
        toast.error("Failed to initialize upload configuration");
      }
    };
    fetchUploadConfig();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error, clearErrors]);

  const handleUploadSuccess = (result) => {
    const newImage = {
      public_id: result.info.public_id,
      url: result.info.secure_url,
    };
    addProductImages([newImage], id);
    toast.success("Image ajoutée avec succès!");
  };

  const handleUploadError = (error) => {
    console.error("Upload error:", error);
    toast.error("Échec de l'upload");
  };

  const handleRemoveImage = async (imageToRemove) => {
    if (imageToRemove._id) {
      try {
        setIsRemoving((prev) => ({ ...prev, [imageToRemove._id]: true }));
        await new Promise((resolve) => setTimeout(resolve, 300));
        await removeProductImage(id, imageToRemove._id);
        toast.success("Image supprimée");
      } catch (err) {
        setIsRemoving((prev) => ({ ...prev, [imageToRemove._id]: false }));
        toast.error("Échec de la suppression");
      }
    }
  };

  const getWidgetOptions = () => {
    if (!uploadConfig) return {};
    return {
      multiple: true,
      maxFiles: 10,
      folder: "buyitnow/products",
      resourceType: "image",
      clientAllowedFormats: ["jpeg", "jpg", "png", "webp"],
      maxFileSize: 5000000,
      sources: ["local", "url", "camera"],
      showAdvancedOptions: false,
      cropping: false,
      styles: {
        palette: {
          window: "#ffffff",
          sourceBg: "#f4f4f5",
          windowBorder: "#90a0b3",
          tabIcon: "#000000",
          inactiveTabIcon: "#555a5f",
          menuIcons: "#555a5f",
          link: "#0433ff",
          action: "#339933",
          inProgress: "#0433ff",
          complete: "#339933",
          error: "#cc0000",
          textDark: "#000000",
          textLight: "#fcfffd",
        },
      },
    };
  };

  if (!uploadConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 py-8 px-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 font-medium">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Galerie du Produit
          </h1>
          <p className="text-slate-600">Gérez les images de votre produit</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
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
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Images du produit
                  </h2>
                  <p className="text-white/80">
                    {productImages?.length || 0} image
                    {(productImages?.length || 0) !== 1 ? "s" : ""} • Max 10
                  </p>
                </div>
              </div>
              <CldUploadWidget
                signatureEndpoint="/api/cloudinary/sign"
                options={getWidgetOptions()}
                onSuccess={handleUploadSuccess}
                onError={handleUploadError}
              >
                {({ open }) => (
                  <button
                    onClick={() => open()}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-white/90 transition-all shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
                    {loading ? "Traitement..." : "Ajouter des images"}
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>

          <div className="p-8">
            {productImages && productImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {productImages.map((img) => (
                  <div key={img._id} className="relative group">
                    <div className="aspect-square rounded-xl overflow-hidden border-2 border-slate-200 group-hover:border-purple-400 transition-all">
                      <CldImage
                        src={img.public_id}
                        alt="Product"
                        width={200}
                        height={200}
                        crop="fill"
                        gravity="center"
                        className={`object-cover w-full h-full transition-all duration-300 group-hover:scale-110 ${
                          isRemoving[img._id]
                            ? "opacity-0 scale-75"
                            : "opacity-100"
                        }`}
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveImage(img)}
                      disabled={loading}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 disabled:opacity-50 shadow-lg"
                      title="Supprimer"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                <svg
                  className="w-24 h-24 mx-auto text-slate-300 mb-4"
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
                <p className="text-lg font-semibold text-slate-600 mb-2">
                  Aucune image
                </p>
                <p className="text-slate-500">
                  Cliquez sur "Ajouter des images" pour commencer
                </p>
              </div>
            )}

            <div className="mt-8 grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                <div className="flex gap-3">
                  <svg
                    className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-blue-800 mb-1">
                      Formats acceptés
                    </p>
                    <p className="text-sm text-blue-700">
                      JPEG, JPG, PNG, WebP
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-4">
                <div className="flex gap-3">
                  <svg
                    className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-purple-800 mb-1">
                      Taille maximale
                    </p>
                    <p className="text-sm text-purple-700">5 MB par image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

UploadImages.displayName = "UploadImages";

export default UploadImages;
