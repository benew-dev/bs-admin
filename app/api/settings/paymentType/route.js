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

  const totalPaymentType = await PaymentType.countDocuments();

  if (totalPaymentType < 4) {
    const body = await req.json();
    const paymentType = await PaymentType.create(body);

    return NextResponse.json(
      {
        paymentType,
      },
      { status: 201 },
    );
  } else {
    const error =
      "You have reached the maximum limit, 4, of payment types. To add another payment platform, delete one.";

    return NextResponse.json(
      {
        error,
      },
      { status: 401 },
    );
  }
}
