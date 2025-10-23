import dbConnect from "@/backend/config/dbConnect";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import Order from "@/backend/models/order";
import { NextResponse } from "next/server";

export async function GET(req) {
  await isAuthenticatedUser(req, NextResponse);
  authorizeRoles(NextResponse, "admin");
  await dbConnect();

  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const startOfMonth = new Date(currentYear, now.getMonth(), 1);
    const endOfMonth = new Date(
      currentYear,
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    // Stats globales avec support CASH
    const [
      ordersPaidCount,
      ordersUnpaidCount,
      ordersPendingCashCount,
      ordersCancelledCount,
      ordersRefundedCount,
    ] = await Promise.all([
      Order.countDocuments({ paymentStatus: "paid" }),
      Order.countDocuments({ paymentStatus: "unpaid" }),
      Order.countDocuments({ paymentStatus: "pending_cash" }),
      Order.countDocuments({ paymentStatus: "cancelled" }),
      Order.countDocuments({ paymentStatus: "refunded" }),
    ]);

    // Statistiques mensuelles par statut
    const [
      totalOrdersPaidThisMonth,
      totalOrdersUnpaidThisMonth,
      totalOrdersPendingCashThisMonth,
      totalOrdersCancelledThisMonth,
      totalOrdersRefundedThisMonth,
    ] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            totalOrdersPaid: { $sum: 1 },
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            paymentStatus: "unpaid",
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            totalOrdersUnpaid: { $sum: 1 },
            potentialRevenue: { $sum: "$totalAmount" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            paymentStatus: "pending_cash",
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            totalOrdersPendingCash: { $sum: 1 },
            potentialRevenue: { $sum: "$totalAmount" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            paymentStatus: "cancelled",
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            totalOrdersCancelled: { $sum: 1 },
            lostRevenue: { $sum: "$totalAmount" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            paymentStatus: "refunded",
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            totalOrdersRefunded: { $sum: 1 },
            refundedAmount: { $sum: "$totalAmount" },
          },
        },
      ]),
    ]);

    // Listes détaillées des commandes du mois
    const [
      listOrdersPaidThisMonth,
      listOrdersUnpaidThisMonth,
      listOrdersPendingCashThisMonth,
    ] = await Promise.all([
      Order.find({
        paymentStatus: "unpaid",
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      })
        .select(
          "orderNumber totalAmount orderItems paymentInfo paymentStatus createdAt updatedAt",
        )
        .sort({ createdAt: -1 })
        .lean(),
      Order.find({
        paymentStatus: "pending_cash",
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      })
        .select(
          "orderNumber totalAmount orderItems paymentInfo paymentStatus createdAt updatedAt",
        )
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    // Calculer itemCount pour chaque commande
    const addItemCount = (orders) =>
      orders.map((order) => ({
        ...order,
        itemCount: order.orderItems.reduce(
          (total, item) => total + item.quantity,
          0,
        ),
      }));

    return NextResponse.json(
      {
        // Stats globales
        ordersPaidCount,
        ordersUnpaidCount,
        ordersPendingCashCount,
        ordersCancelledCount,
        ordersRefundedCount,

        // Stats mensuelles
        totalOrdersPaidThisMonth,
        totalOrdersUnpaidThisMonth,
        totalOrdersPendingCashThisMonth,
        totalOrdersCancelledThisMonth,
        totalOrdersRefundedThisMonth,

        // Listes détaillées
        listOrdersPaidThisMonth: addItemCount(listOrdersPaidThisMonth),
        listOrdersUnpaidThisMonth: addItemCount(listOrdersUnpaidThisMonth),
        listOrdersPendingCashThisMonth: addItemCount(
          listOrdersPendingCashThisMonth,
        ),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching orders purchasing stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders statistics" },
      { status: 500 },
    );
  }
}
