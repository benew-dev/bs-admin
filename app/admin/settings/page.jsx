import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";

const Settings = dynamic(() => import("@/components/settings/Settings"), {
  loading: () => <Loading />,
});

import {
  getCategoryData,
  getPaymentTypeData,
} from "@/backend/utils/server-only-methods";

export const metadata = {
  title: "Dashboard - Settings",
};

const SettingsPage = async () => {
  const categoryData = await getCategoryData();
  const paymentTypeData = await getPaymentTypeData();

  return <Settings dataCategory={categoryData} dataPayment={paymentTypeData} />;
};

export default SettingsPage;
