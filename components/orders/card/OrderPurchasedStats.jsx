/* eslint-disable react/prop-types */
import React from "react";
import OrderStatCard from "./OrderStatCard";

const OrderPurchasedStats = ({ open, data }) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const statsData = [
    {
      title: "All Paid",
      content: `${data?.ordersPaidCount === undefined ? "0 order" : `${data?.ordersPaidCount} order(s)`}`,
      indication: "Since the beginning",
      color: "green",
    },
    {
      title: "Orders Unpaid",
      content: `${data?.ordersUnpaidCount === undefined ? "0 order" : `${data?.ordersUnpaidCount} order(s)`}`,
      indication: "Since the beginning",
      color: "orange",
    },
    {
      title: "Orders Cancelled",
      content: `${data?.ordersCancelledCount === undefined ? "0 order" : `${data?.ordersCancelledCount} order(s)`}`,
      indication: "Since the beginning",
      color: "red",
    },
    {
      title: "Orders Refunded",
      content: `${data?.ordersRefundedCount === undefined ? "0 order" : `${data?.ordersRefundedCount} order(s)`}`,
      indication: "Since the beginning",
      color: "purple",
    },
    {
      title: "Paid This Month",
      content: `${data?.totalOrdersPaidThisMonth?.[0] === undefined ? "0 order" : `${data?.totalOrdersPaidThisMonth[0]?.totalOrdersPaid} order(s)`}`,
      indication: `${currentMonth}/${currentYear}`,
      color: "green",
    },
    {
      title: "Unpaid This Month",
      content: `${data?.totalOrdersUnpaidThisMonth?.[0] === undefined ? "0 order" : `${data?.totalOrdersUnpaidThisMonth[0]?.totalOrdersUnpaid} order(s)`}`,
      indication: `${currentMonth}/${currentYear}`,
      color: "orange",
    },
    {
      title: "Cancelled This Month",
      content: `${data?.totalOrdersCancelledThisMonth?.[0] === undefined ? "0 order" : `${data?.totalOrdersCancelledThisMonth[0]?.totalOrdersCancelled} order(s)`}`,
      indication: `${currentMonth}/${currentYear}`,
      color: "red",
    },
    {
      title: "Refunded This Month",
      content: `${data?.totalOrdersRefundedThisMonth?.[0] === undefined ? "0 order" : `${data?.totalOrdersRefundedThisMonth[0]?.totalOrdersRefunded} order(s)`}`,
      indication: `${currentMonth}/${currentYear}`,
      color: "purple",
    },
  ];

  return (
    <div className={`${!open && "hidden"} flex flex-wrap justify-evenly gap-3`}>
      {statsData?.map((item, index) => (
        <OrderStatCard
          key={index}
          title={item?.title}
          content={item?.content}
          indication={item?.indication}
          color={item?.color}
        />
      ))}
    </div>
  );
};

export default OrderPurchasedStats;
