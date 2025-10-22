import dbConnect from "@/backend/config/dbConnect";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import PaymentType from "@/backend/models/paymentType";
import { NextResponse } from "next/server";

export async function GET(req) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  // Connexion DB
  await dbConnect();

  const paymentTypes = await PaymentType.find();

  return NextResponse.json(
    {
      paymentTypes,
    },
    { status: 200 },
  );
}

export async function POST(req) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  // Connexion DB
  await dbConnect();

  const body = await req.json();

  // Vérifier si c'est un paiement CASH
  const isCashPayment = body.platform === "CASH";

  // Compter les moyens de paiement existants
  const totalPaymentType = await PaymentType.countDocuments();

  // Vérifier si CASH existe déjà
  if (isCashPayment) {
    const existingCash = await PaymentType.findOne({ platform: "CASH" });
    if (existingCash) {
      return NextResponse.json(
        {
          error:
            "Cash payment option already exists. You can only have one cash payment option.",
        },
        { status: 400 },
      );
    }
  }

  // Limite: 5 moyens de paiement maximum (4 électroniques + 1 CASH)
  if (totalPaymentType < 5) {
    try {
      const paymentType = await PaymentType.create(body);

      console.log("Payment type created:", {
        platform: paymentType.platform,
        isCash: paymentType.isCashPayment,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          paymentType,
          message: `${isCashPayment ? "Cash payment option" : "Payment type"} added successfully`,
        },
        { status: 201 },
      );
    } catch (error) {
      console.error("Error creating payment type:", error);

      // Gestion des erreurs de validation du modèle
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(
          (err) => err.message,
        );
        return NextResponse.json(
          {
            error: "Validation failed",
            details: validationErrors,
          },
          { status: 400 },
        );
      }

      // Gestion des doublons
      if (error.code === 11000) {
        return NextResponse.json(
          {
            error: "This payment platform already exists",
          },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          error: "Failed to create payment type",
          message: error.message,
        },
        { status: 500 },
      );
    }
  } else {
    const error =
      "You have reached the maximum limit of 5 payment types (4 electronic + 1 cash). To add another payment platform, delete one.";

    return NextResponse.json(
      {
        error,
      },
      { status: 400 },
    );
  }
}
