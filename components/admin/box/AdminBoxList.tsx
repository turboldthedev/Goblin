// app/admin/boxes/page.tsx
"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Package } from "lucide-react";
import { toast } from "@/hooks/use-toast";

import { AnimatedBackground } from "@/components/admin/box/AnimatedBackground";
import { CreateBoxTemplateSheet } from "@/components/admin/box/CreateBoxSheet";
import { BoxFormState } from "@/components/admin/box/CreateBoxSheet";
import { FilterBar } from "@/components/admin/box/FilterBar";
import { BoxGrid } from "@/components/admin/box/BoxGrid";
import { BoxTemplate } from "@/components/admin/box/BoxCard";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

export default function AdminBoxList() {
  // --- SWR for listing templates ---
  const { data, error, mutate } = useSWR<{ templates: BoxTemplate[] }>(
    "/api/admin/box",
    fetcher
  );

  // --- Form state ---
  const [form, setForm] = useState<BoxFormState>({
    name: "",
    normalPrize: 500000,
    goldenPrize: 5000000,
    goldenChance: 0.01,
    active: true,
    imageUrl: "",
    missionUrl: "",
    missionDesc: "",
    boxType: "normal",
    promoCode: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // --- Filter/Search state ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  // --- Handlers for form inputs ---
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "normalPrize" ||
        name === "goldenPrize" ||
        name === "goldenChance"
          ? Number(value)
          : value,
    }));
  };

  const onBoxTypeChange = (value: BoxFormState["boxType"]) => {
    setForm((prev) => ({
      ...prev,
      boxType: value,
      // If switched back to "normal", clear promoCode
      promoCode: value === "normal" ? "" : prev.promoCode,
    }));
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // --- Upload to Cloudinary (helper) ---
  const uploadImage = async (): Promise<string> => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      throw new Error("Image upload failed");
    }
    const data = await res.json();
    return data.url as string;
  };

  // --- Submit handler ---
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      if (file) {
        imageUrl = await uploadImage();
      }

      const payload = { ...form, imageUrl };
      console.log(payload);
      const res = await fetch("/api/admin/box", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        toast({
          variant: "destructive",
          title: "Error creating template",
          description: err.error || "Please check your input and try again.",
        });
      } else {
        toast({
          title: "Template created",
          description: "New box template has been added.",
        });
        // Reset form
        setForm({
          name: "",
          normalPrize: 500000,
          goldenPrize: 5000000,
          goldenChance: 0.01,
          active: true,
          imageUrl: "",
          missionUrl: "",
          missionDesc: "",
          boxType: "normal",
          promoCode: "",
        });
        setFile(null);
        setIsDrawerOpen(false);
        mutate(); // re-fetch list
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Network error",
        description: err.message || "Unable to create template.",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Filter the fetched templates ---
  const filteredTemplates = data?.templates.filter((template) => {
    const matchesSearch = template.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterActive === null || template.active === filterActive;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 1) Animated background (stacked behind everything) */}
      <AnimatedBackground />

      {/* 2) Main content area */}
      <main className="relative z-10 flex h-screen overflow-hidden">
        <div className="flex-1 overflow-auto p-8">
          {/* HEADER + CREATE BUTTON */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-lime-300 to-lime-500 text-transparent bg-clip-text">
                Boxes
              </h1>
              <p className="text-lime-300/70 mt-2">
                Manage prize boxes and their configurations
              </p>
            </div>

            <CreateBoxTemplateSheet
              isOpen={isDrawerOpen}
              onOpenChange={setIsDrawerOpen}
              form={form}
              file={file}
              onBoxTypeChange={onBoxTypeChange} // ← new
              loading={loading}
              onChange={onChange}
              onFileChange={onFileChange}
              onSubmit={onSubmit}
            />
          </div>

          {/* 3) FILTER BAR */}
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            filterActive={filterActive}
            onFilterActiveChange={setFilterActive}
          />

          {/* 4) TEMPLATES GRID (or Loading / Error states) */}
          {!data && !error && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Package className="h-12 w-12 text-lime-400 mx-auto mb-4" />
                <p className="text-lime-300">Loading templates…</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Package className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-400">Failed to load templates.</p>
              </div>
            </div>
          )}

          {data && filteredTemplates && filteredTemplates.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Package className="h-12 w-12 text-lime-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-lime-300 mb-2">
                  No Templates Found
                </h3>
                <p className="text-lime-300/70 max-w-md">
                  {searchTerm || filterActive !== null
                    ? "No templates match your current filters."
                    : "Get started by creating your first box template."}
                </p>
              </div>
            </div>
          )}

          {data && filteredTemplates && filteredTemplates.length > 0 && (
            <BoxGrid templates={filteredTemplates} onUpdated={() => mutate()} />
          )}
        </div>
      </main>
    </div>
  );
}
