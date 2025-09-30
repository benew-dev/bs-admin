import React from "react";
// import dynamic from "next/dynamic";
// import Loading from "../loading";

// const Overview = dynamic(() => import("@/components/overview/Overview"), {
//   loading: () => <Loading />,
// });

import {
  getAllOrders,
  getCategoryData,
  getPaymentTypeData,
} from "@/backend/utils/server-only-methods";

export const metadata = {
  title: "Dashboard - Overview",
};

// eslint-disable-next-line react/prop-types
const HomePage = async ({ searchParams }) => {
  // const orders = await getAllOrders(await searchParams);
  // const categoryData = await getCategoryData();
  // const paymentTypeData = await getPaymentTypeData();

  // return (
  //   <Overview
  //     orders={orders}
  //     categories={categoryData?.categories}
  //     paymentTypes={paymentTypeData?.paymentTypes}
  //   />
  // );

  return <p>Overview page not implemented for now</p>;
};

export default HomePage;
