"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Item = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
};

function ItemsList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.data);
      })
      .catch(() => {
        setError("Failed to load items");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading items...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!items || items.length === 0) return <div>No items found.</div>;

  return (
    <div className="">
      <ul className="mt-8">
        {items.map((item) => (
          <li key={item.id} className="mb-8">
            <strong>{item.name}</strong>
            <br />
            <small>{item.description}</small>
            <br />
            <small style={{ color: "#666" }}>
              Created: {new Date(item.createdAt).toLocaleDateString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Root() {
  const router = useRouter();

  const handleAddItem = () => {
    router.push("/item/new");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Available Items</h1>
      <button className="border-2 border-green-500" onClick={handleAddItem}>
        Add Item
      </button>
      <ItemsList />
    </div>
  );
}
