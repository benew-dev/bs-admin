"use client";

import SettingsContext from "@/context/SettingsContext";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

const AddPaymentType = () => {
  const { newPaymentType, error, clearErrors } = useContext(SettingsContext);
  const [platform, setPlatform] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [platformNumber, setPlatformNumber] = useState("");

  const platforms = [
    { value: "WAAFI", label: "WAAFI", color: "from-blue-500 to-blue-600" },
    {
      value: "D-MONEY",
      label: "D-MONEY",
      color: "from-purple-500 to-purple-600",
    },
    {
      value: "CAC-PAY",
      label: "CAC-PAY",
      color: "from-green-500 to-green-600",
    },
    {
      value: "BCI-PAY",
      label: "BCI-PAY",
      color: "from-orange-500 to-orange-600",
    },
  ];

  const submitHandler = (e) => {
    e.preventDefault();

    if (!platform) {
      toast.error("Veuillez sélectionner une plateforme");
      return;
    }

    if (!accountHolderName.trim()) {
      toast.error("Veuillez entrer le nom du titulaire");
      return;
    }

    if (!platformNumber.trim()) {
      toast.error("Veuillez entrer le numéro de compte");
      return;
    }

    // Les paramètres doivent correspondre à la structure du modèle
    newPaymentType(platform, accountHolderName, platformNumber);
  };

  const selectedPlatform = platforms.find((p) => p.value === platform);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Nouveau Moyen de Paiement
          </h1>
          <p className="text-slate-600">
            Ajoutez une plateforme de paiement mobile
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
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
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Ajouter un moyen de paiement
                </h2>
                <p className="text-white/80">Maximum 4 moyens autorisés</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Sélection de la plateforme */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Plateforme de paiement <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map((plat) => (
                  <button
                    key={plat.value}
                    type="button"
                    onClick={() => setPlatform(plat.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      platform === plat.value
                        ? `border-green-500 bg-gradient-to-br ${plat.color} text-white shadow-lg scale-105`
                        : "border-slate-200 bg-white text-slate-700 hover:border-green-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {platform === plat.value && (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span className="font-bold">{plat.label}</span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Sélectionnez la plateforme de paiement mobile
              </p>
            </div>

            {/* Nom du titulaire */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nom du titulaire du compte{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-slate-400 group-focus-within:text-green-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  placeholder="Ex: Mohamed Ahmed"
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-slate-700"
                />
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Nom de la personne à qui appartient le compte
              </p>
            </div>

            {/* Numéro de compte */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Numéro de compte <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-slate-400 group-focus-within:text-green-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <input
                  type="tel"
                  value={platformNumber}
                  onChange={(e) => setPlatformNumber(e.target.value)}
                  placeholder="Ex: 77 12 34 56"
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-slate-700"
                />
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Numéro associé au compte {platform || "de la plateforme"}
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
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
                  <p className="text-sm font-semibold text-green-800 mb-1">
                    Information
                  </p>
                  <p className="text-sm text-green-700">
                    Ce numéro sera utilisé pour recevoir les paiements des
                    clients. Assurez-vous qu'il appartient bien à la personne
                    indiquée.
                  </p>
                </div>
              </div>
            </div>

            {/* Aperçu */}
            <div className="bg-gradient-to-br from-slate-50 to-green-50 rounded-xl p-6 border-2 border-dashed border-slate-300">
              <p className="text-xs uppercase text-slate-500 font-semibold mb-3">
                Aperçu
              </p>
              <div
                className={`bg-gradient-to-br ${selectedPlatform?.color || "from-green-500 to-emerald-600"} rounded-xl p-6 text-white`}
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6"
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
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-lg font-bold">
                    {platform || "Plateforme"}
                  </h3>
                  {platform && (
                    <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-white/90 text-sm mb-2">
                  <span className="text-white/70">Titulaire:</span>{" "}
                  {accountHolderName || "Nom du titulaire"}
                </p>
                <p className="text-white/90 font-mono text-sm">
                  <span className="text-white/70">Numéro:</span>{" "}
                  {platformNumber || "Numéro de compte"}
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={submitHandler}
                disabled={
                  !platform ||
                  !accountHolderName.trim() ||
                  !platformNumber.trim()
                }
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentType;
