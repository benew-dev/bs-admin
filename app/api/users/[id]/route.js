import dbConnect from "@/backend/config/dbConnect";
import Order from "@/backend/models/order";
import User from "@/backend/models/user";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Cart from "@/backend/models/cart";

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    await dbConnect();

    // Utiliser .lean() pour obtenir un objet JavaScript pur
    // Cela évite tous les middlewares et transformations Mongoose
    let user = await User.findById(id).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No user found" },
        { status: 404 },
      );
    }

    const orders = await Order.find({
      user: new mongoose.Types.ObjectId(user._id),
    })
      .select(
        "orderNumber totalAmount paymentInfo.typePayment paymentStatus createdAt paidAt",
      )
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(); // Ajout de .lean() aussi pour les orders

    // Pas besoin de toObject() avec .lean()
    // Supprimer manuellement les champs sensibles
    delete user.password;
    delete user.loginAttempts;
    delete user.lockUntil;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpire;
    delete user.__v;

    // Ajouter la vérification des stats si nécessaire
    if (user.purchaseStats && user.purchaseStats.totalOrders > 0) {
      user.purchaseStatsCalculated = true;
    }

    return NextResponse.json({
      success: true,
      user: user,
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
  const { id } = await params;

  try {
    await dbConnect();

    let user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No user found" },
        { status: 404 },
      );
    }

    const body = await req.json();
    user = await User.findByIdAndUpdate(id, body.userData, {
      new: true,
      runValidators: true,
    }).lean();

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error("Error in updateUser:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;

  try {
    await dbConnect();

    let user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No user found" },
        { status: 404 },
      );
    }

    const cartContainingThisProduct = await Cart.countDocuments({
      user: user._id,
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
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
