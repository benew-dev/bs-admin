import Order from "@/backend/models/order";
import Category from "@/backend/models/category";
import { NextResponse } from "next/server";
import dbConnect from "@/backend/config/dbConnect";
import Product from "@/backend/models/product";
import User from "@/backend/models/user";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";

export async function GET(req, { params }) {
  await isAuthenticatedUser(req, NextResponse);
  authorizeRoles(NextResponse, "admin");

  const { id } = params;
  await dbConnect();

  const order = await Order.findById(id).populate("user", "name phone email");

  if (!order) {
    return NextResponse.json({ message: "No Order found" }, { status: 404 });
  }

  return NextResponse.json({ order }, { status: 200 });
}

export async function PUT(req, { params }) {
  await isAuthenticatedUser(req, NextResponse);
  authorizeRoles(NextResponse, "admin");

  const { id } = params;
  const body = await req.json();

  await dbConnect();

  let order = await Order.findById(id);

  if (!order) {
    return NextResponse.json({ message: "No Order found" }, { status: 404 });
  }

  if (body.paymentStatus) {
    const currentStatus = order.paymentStatus;
    const newStatus = body.paymentStatus;

    // Définir les transitions autorisées avec support CASH
    const allowedTransitions = {
      unpaid: ["paid", "cancelled"],
      pending_cash: ["paid", "cancelled"], // CASH peut passer à payé ou annulé
      paid: ["refunded"],
      refunded: [],
      cancelled: [],
    };

    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot change payment status from '${currentStatus}' to '${newStatus}'`,
        },
        { status: 400 },
      );
    }

    try {
      // Gestion des transitions de statut

      // 1. Passage à "paid" (depuis unpaid ou pending_cash)
      if (
        (currentStatus === "unpaid" || currentStatus === "pending_cash") &&
        newStatus === "paid"
      ) {
        const productIds = order.orderItems.map((item) => item.product);
        const products = await Product.find({
          _id: { $in: productIds },
        }).populate("category");

        const categoryUpdates = new Map();

        order.orderItems.forEach((item) => {
          const product = products.find(
            (p) => p._id.toString() === item.product.toString(),
          );
          if (product && product.category) {
            const categoryId = product.category._id.toString();
            if (categoryUpdates.has(categoryId)) {
              categoryUpdates.set(
                categoryId,
                categoryUpdates.get(categoryId) + item.quantity,
              );
            } else {
              categoryUpdates.set(categoryId, item.quantity);
            }
          }
        });

        // Mise à jour des produits (incrémenter sold uniquement)
        const bulkOpsForPaid = order.orderItems.map((item) => ({
          updateOne: {
            filter: { _id: item.product },
            update: {
              $inc: {
                sold: item.quantity,
              },
            },
          },
        }));

        // Mise à jour des catégories
        const bulkOpsForCategories = Array.from(categoryUpdates.entries()).map(
          ([categoryId, quantity]) => ({
            updateOne: {
              filter: { _id: categoryId },
              update: {
                $inc: {
                  sold: quantity,
                },
              },
            },
          }),
        );

        const promises = [];
        if (bulkOpsForPaid.length > 0) {
          promises.push(Product.bulkWrite(bulkOpsForPaid));
        }
        if (bulkOpsForCategories.length > 0) {
          promises.push(Category.bulkWrite(bulkOpsForCategories));
        }

        await Promise.all(promises);
        order.paidAt = Date.now();
      }

      // 2. Passage à "refunded"
      else if (currentStatus === "paid" && newStatus === "refunded") {
        const productIds = order.orderItems.map((item) => item.product);
        const products = await Product.find({
          _id: { $in: productIds },
        }).populate("category");

        const categoryUpdates = new Map();

        order.orderItems.forEach((item) => {
          const product = products.find(
            (p) => p._id.toString() === item.product.toString(),
          );
          if (product && product.category) {
            const categoryId = product.category._id.toString();
            if (categoryUpdates.has(categoryId)) {
              categoryUpdates.set(
                categoryId,
                categoryUpdates.get(categoryId) + item.quantity,
              );
            } else {
              categoryUpdates.set(categoryId, item.quantity);
            }
          }
        });

        // Restaurer le stock et décrémenter sold
        const bulkOpsForRefunded = order.orderItems.map((item) => ({
          updateOne: {
            filter: { _id: item.product },
            update: {
              $inc: {
                sold: -item.quantity,
                stock: item.quantity,
              },
            },
          },
        }));

        const bulkOpsForCategories = Array.from(categoryUpdates.entries()).map(
          ([categoryId, quantity]) => ({
            updateOne: {
              filter: { _id: categoryId },
              update: {
                $inc: {
                  sold: -quantity,
                },
              },
            },
          }),
        );

        const promises = [];
        if (bulkOpsForRefunded.length > 0) {
          promises.push(Product.bulkWrite(bulkOpsForRefunded));
        }
        if (bulkOpsForCategories.length > 0) {
          promises.push(Category.bulkWrite(bulkOpsForCategories));
        }

        await Promise.all(promises);
        order.cancelledAt = Date.now();
        if (body.cancelReason) {
          order.cancelReason = body.cancelReason;
        }
      }

      // 3. Passage à "cancelled"
      else if (newStatus === "cancelled") {
        // Si on annule depuis pending_cash ou unpaid, on restaure le stock
        if (currentStatus === "pending_cash" || currentStatus === "unpaid") {
          const bulkOpsForCancelled = order.orderItems.map((item) => ({
            updateOne: {
              filter: { _id: item.product },
              update: {
                $inc: {
                  stock: item.quantity, // Restaurer le stock
                },
              },
            },
          }));

          if (bulkOpsForCancelled.length > 0) {
            await Product.bulkWrite(bulkOpsForCancelled);
          }
        }

        order.cancelledAt = Date.now();
        if (body.cancelReason) {
          order.cancelReason = body.cancelReason;
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du stock/sold:", error);
      return NextResponse.json(
        {
          success: false,
          message:
            "Erreur lors de la mise à jour du stock des produits et catégories",
          error: error.message,
        },
        { status: 500 },
      );
    }

    order.paymentStatus = newStatus;

    if (body.cancelReason) {
      order.cancelReason = body.cancelReason;
    }

    await order.save();
    order = await Order.findById(id);
  }

  return NextResponse.json(
    {
      success: true,
      order,
    },
    { status: 200 },
  );
}
