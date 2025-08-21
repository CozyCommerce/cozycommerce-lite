"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { SiteSettings } from "@prisma/client";

const SettingsPage = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [currency, setCurrency] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/admin/settings");
        setSettings(response.data);
        setCurrency(response.data.currency);
      } catch (error) {
        toast.error("Failed to fetch settings.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.patch("/api/admin/settings", { currency });
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="p-8">Loading settings...</div>;
  }

  return (
    <section className="p-8">
      <h1 className="text-4xl font-bold mb-6">Site Settings</h1>
      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-md max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="currency">
            Site Currency
          </label>
          <input
            id="currency"
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., EGP, USD, EUR"
            required
          />
           <p className="text-sm text-gray-500 mt-1">Set the default currency for the entire site (e.g., EGP).</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition disabled:bg-gray-400"
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </section>
  );
};

export default SettingsPage;
