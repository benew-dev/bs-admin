/* eslint-disable react/prop-types */
"use client";

import dynamic from "next/dynamic";
import React, { memo, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "@/app/loading";

const CustomPagination = dynamic(
  () => import("@/components/layouts/CustomPagniation"),
);
import ProductContext from "@/context/ProductContext";

const ProductsTable = dynamic(() => import("./table/ProductsTable"), {
  loading: () => <Loading />,
});

import Search from "../layouts/Search";
import ProductsFilter from "./ProductsFilter";

const Products = memo(({ data }) => {
  const { deleteProduct, error, loading, setLoading, clearErrors } =
    useContext(ProductContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const deleteHandler = (id) => {
    deleteProduct(id);
  };

  return (
    <div className="relative overflow-x-auto">
      {/* Header amélioré avec gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Gestion des Produits
            </h1>
            <p className="text-blue-100 text-sm">
              Gérez et organisez tous vos produits en vente
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="px-4 py-2.5 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              title="Filtrer les produits"
            >
              <i className="fa fa-sliders" aria-hidden="true"></i>
              <span className="hidden sm:inline">Filtres</span>
            </button>
            <Search setLoading={setLoading} />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className={`${!open && "hidden"} mb-6`}>
        <ProductsFilter
          open={open}
          setLoading={setLoading}
          categories={data?.categories}
        />
      </div>

      {/* Table Section avec design amélioré */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-8">
            <Loading />
          </div>
        ) : (
          <ProductsTable
            products={data?.products}
            itemCount={data?.filteredProductsCount}
            deleteHandler={deleteHandler}
          />
        )}
      </div>

      {/* Pagination avec design amélioré */}
      {data?.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <CustomPagination totalPages={data?.totalPages} />
        </div>
      )}
    </div>
  );
});

Products.displayName = "Products";

export default Products;
