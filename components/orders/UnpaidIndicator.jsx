"use client";

export default function UnpaidIndicator({ createdAt, paymentStatus }) {
  // Afficher seulement pour unpaid et pending_cash
  if (paymentStatus !== "unpaid" && paymentStatus !== "pending_cash")
    return null;

  const orderDate = new Date(createdAt);
  const now = new Date();
  const hoursDiff = Math.floor((now - orderDate) / (1000 * 60 * 60));

  // Badge spécifique pour pending_cash
  if (paymentStatus === "pending_cash") {
    if (hoursDiff < 24) {
      return (
        <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
          <span className="hidden sm:inline">💰 Cash - {hoursDiff}h</span>
          <span className="sm:hidden">💰</span>
        </span>
      );
    }

    if (hoursDiff < 48) {
      return (
        <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-300">
          <span className="hidden sm:inline">⚠️ Cash +24h</span>
          <span className="sm:hidden">⚠️</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300 animate-pulse">
        <span className="hidden sm:inline">🚨 Cash +48h</span>
        <span className="sm:hidden">🚨</span>
      </span>
    );
  }

  // Badge pour unpaid (paiement électronique)
  if (hoursDiff < 24) {
    return (
      <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <span className="hidden sm:inline">⏳ {hoursDiff}h</span>
        <span className="sm:hidden">⏳</span>
      </span>
    );
  }

  if (hoursDiff < 48) {
    return (
      <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
        <span className="hidden sm:inline">⚠️ +24h</span>
        <span className="sm:hidden">⚠️</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
      <span className="hidden sm:inline">🚨 +48h</span>
      <span className="sm:hidden">🚨</span>
    </span>
  );
}
