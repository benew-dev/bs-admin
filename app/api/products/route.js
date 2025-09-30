import dbConnect from "@/backend/config/dbConnect";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import Category from "@/backend/models/category";
import Product from "@/backend/models/product";
import User from "@/backend/models/user";
import APIFilters from "@/backend/utils/APIFilters";
import { NextResponse } from "next/server";

export async function GET(req) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  await authorizeRoles(NextResponse, "admin");

  // Connexion DB
  await dbConnect();

  const resPerPage = 2;
  const productsCount = await Product.countDocuments();

  const apiFilters = new APIFilters(Product.find(), req.nextUrl.searchParams)
    .search()
    .filter();

  let products = await apiFilters.query.populate("category");
  const filteredProductsCount = products.length;

  apiFilters.pagination(resPerPage);

  products = await apiFilters.query.clone();

  const result = filteredProductsCount / resPerPage;
  const totalPages = Number.isInteger(result) ? result : Math.ceil(result);

  const categories = await Category.find();

  return NextResponse.json(
    {
      categories,
      totalPages,
      productsCount,
      filteredProductsCount,
      products,
    },
    {
      status: 200,
    },
  );
}

export async function POST(req) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  await authorizeRoles(NextResponse, "admin");

  // Connexion DB
  await dbConnect();

  const body = await req.json();

  const product = await Product.create(body);

  return NextResponse.json(
    {
      success: true,
      product,
    },
    {
      status: 201,
    },
  );
}
