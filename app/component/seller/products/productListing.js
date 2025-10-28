"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/app/action/ProductAction";
import { displayCurrency } from "@/lib/utils";

export default function ProductList({ sellerId, onSelectionChange }) {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [quantities, setQuantities] = useState({});
  const [selectedVariations, setSelectedVariations] = useState({});

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts(sellerId);
      setProducts(data);

      const initialQuantities = {};
      const initialVariations = {};
      data.forEach((product) => {
        initialQuantities[product._id] = 1;

        if (product.variations?.length > 0) {
          initialVariations[product._id] = {};
          product.variations.forEach((variation) => {
            initialVariations[product._id][variation.name] =
              variation.options[0];
          });
        }
      });

      setQuantities(initialQuantities);
      setSelectedVariations(initialVariations);
    }
    fetchProducts();
  }, []);

  // ✅ Call parent when selection changes
  useEffect(() => {
    if (!onSelectionChange) return; // safety check

    const selectedItems = products
      .filter((product) => selectedProducts[product._id])
      .map((product) => ({
        id: product._id,
        name: product.name,
        description: product.description,
        basePrice: product.basePrice,
        quantity: quantities[product._id],
        variations: selectedVariations[product._id] || {},
      }));
    console.log(selectedItems);
    onSelectionChange(selectedItems);
  }, [
    products,
    selectedProducts,
    quantities,
    selectedVariations,
    onSelectionChange,
  ]);

  const handleCheckboxChange = (id) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const increaseQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const decreaseQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

  const handleVariationChange = (productId, variationName, selectedOption) => {
    setSelectedVariations((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [variationName]: selectedOption,
      },
    }));
  };

  // Calculate total price
  const calculateTotal = () => {
    let total = 0;
    products.forEach((product) => {
      if (selectedProducts[product._id]) {
        total += product.basePrice * quantities[product._id];
      }
    });
    return total;
  };

  return (
    <div className=" bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Select Your Products
        </h1>
        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl overflow-hidden shadow-lg">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-4 px-6 text-left">Select</th>
                <th className="py-4 px-6 text-left">Product</th>
                <th className="py-4 px-6 text-left">Description</th>
                <th className="py-4 px-6 text-left">Variation</th>
                <th className="py-4 px-6 text-left">Price</th>
                <th className="py-4 px-6 text-center">Quantity</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={!!selectedProducts[product._id]}
                      onChange={() => {
                        handleCheckboxChange(product._id);
                      }}
                      className="w-5 h-5 text-blue-600"
                    />
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-800">
                    {product.name}
                  </td>
                  <td className="py-4 px-6">{product.description}</td>
                  <td className="py-4 px-6">
                    {product.variations?.length > 0 ? (
                      <div className="space-y-2">
                        {product.variations.map((variation, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <label className="text-gray-600">
                              {variation.name}:
                            </label>
                            <select
                              value={
                                selectedVariations[product._id]?.[
                                  variation.name
                                ] || ""
                              }
                              onChange={(e) =>
                                handleVariationChange(
                                  product._id,
                                  variation.name,
                                  e.target.value
                                )
                              }
                              className="border border-gray-300 rounded-lg p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                              {variation.options.map((option, optIdx) => (
                                <option key={optIdx} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">None</span>
                    )}
                  </td>
                  <td className="py-4 px-6 font-semibold text-green-600">
                    {displayCurrency(product.basePrice)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(product._id)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-lg font-bold"
                      >
                        -
                      </button>
                      <span className="text-lg font-semibold">
                        {quantities[product._id]}
                      </span>
                      <button
                        type="button"
                        onClick={() => increaseQuantity(product._id)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-lg font-bold"
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
