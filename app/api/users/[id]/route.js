import dbConnect from "@/backend/config/dbConnect";
import Order from "@/backend/models/order";
import User from "@/backend/models/user";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Cart from "@/backend/models/cart";

export async function GET(req, { params }) {
  const { id } = await params; // ✅ Ajout de await

  try {
    await dbConnect();

    let user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No user found" },
        { status: 404 },
      );
    }

    const orders = await Order.find({
      user: new mongoose.Types.ObjectId(user?._id),
    })
      .select(
        "orderNumber totalAmount paymentInfo.typePayment paymentStatus createdAt paidAt",
      )
      .sort({ createdAt: -1 })
      .limit(50);

    const userObj = user.toObject();
    if (user.purchaseStats && user.purchaseStats.totalOrders > 0) {
      userObj.purchaseStatsCalculated = true;
    }

    return NextResponse.json({
      success: true,
      user: userObj,
      orders,
      orderCount: orders.length,
    });
  } catch (error) {
    console.error("Error in getUser:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(req, { params }) {
  const { id } = await params; // ✅ Ajout de await

  await dbConnect();
  let user = await User.findById(id);

  if (!user) {
    return NextResponse.json(
      { success: false, error: "No user found" },
      { status: 404 },
    );
  }

  user = await User.findByIdAndUpdate(id, req.body.userData);

  return NextResponse.json({ success: true, user }, { status: 200 });
}

export async function DELETE(req, { params }) {
  const { id } = await params; // ✅ Ajout de await

  await dbConnect();
  let user = await User.findById(id);

  if (!user) {
    return NextResponse.json(
      { success: false, error: "No user found" },
      { status: 404 },
    );
  }

  const cartContainingThisProduct = await Cart.countDocuments({
    user: user?._id,
  });

  if (cartContainingThisProduct > 0) {
    return NextResponse.json(
      {
        success: false,
        error: "Cannot delete user. It has one or more carts.",
      },
      { status: 400 },
    );
  }

  await user.deleteOne();

  return NextResponse.json({ success: true }, { status: 200 });
}
