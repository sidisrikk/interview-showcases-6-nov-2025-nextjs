"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ItemFormData {
  name: string;
  description: string;
}

export default function NewItemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    // Basic validation
    if (!formData.name.trim() || !formData.description.trim()) {
      setError("Both name and description are required");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create item");
      }

      setSuccess(true);
      // Clear form
      setFormData({ name: "", description: "" });

      // Redirect to home page
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1>Create New Item</h1>

        {success && (
          <div
            style={{
              padding: "10px",
              marginBottom: "20px",
              backgroundColor: "#d4edda",
              border: "1px solid #c3e6cb",
              color: "#155724",
            }}
          >
            Item created successfully! Redirecting to home page...
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "10px",
              marginBottom: "20px",
              backgroundColor: "#f8d7da",
              border: "1px solid #f5c6cb",
              color: "#721c24",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div>
            <label
              htmlFor="name"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
              }}
              placeholder="Enter item name"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
              }}
              placeholder="Enter item description"
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.5 : 1,
              }}
            >
              {isSubmitting ? "Creating..." : "Create Item"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
