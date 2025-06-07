// components/admin/boxes/EditBoxDrawer.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

import { BoxTemplate } from "./BoxCard";

interface EditBoxDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  template: BoxTemplate;
  onUpdated: () => void;
}

export function EditBoxDrawer({
  isOpen,
  onOpenChange,
  template,
  onUpdated,
}: EditBoxDrawerProps) {
  // Local form state (initialize from `template`)
  const [form, setForm] = useState({
    name: "",
    normalPrize: 0,
    goldenPrize: 0,
    goldenChance: 0,
    active: false,
    imageUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Whenever `template` or drawer re‐opens, re‐populate form state
  useEffect(() => {
    if (template) {
      setForm({
        name: template.name,
        normalPrize: template.normalPrize,
        goldenPrize: template.goldenPrize,
        goldenChance: template.goldenChance,
        active: template.active,
        imageUrl: template.imageUrl || "",
      });
      setFile(null);
    }
  }, [template, isOpen]);

  // Handle simple inputs + checkbox
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      e.target instanceof HTMLInputElement ? e.target.checked : false;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "name" || name === "imageUrl"
            ? value
            : Number(value),
    }));
  };

  // Handle new image file selection
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // If a new file is selected, upload to Cloudinary (same as create)
  const uploadImage = async (): Promise<string> => {
    if (!file) return form.imageUrl; // If no new file, keep old URL
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

  // Submit updated data to your PUT endpoint
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1) If user chose a new file, upload it first
      let newImageUrl = form.imageUrl;
      if (file) {
        newImageUrl = await uploadImage();
      }

      // 2) Build payload and call PUT
      const payload = {
        name: form.name,
        normalPrize: form.normalPrize,
        goldenPrize: form.goldenPrize,
        goldenChance: form.goldenChance,
        active: form.active,
        imageUrl: newImageUrl,
      };

      const res = await fetch(`/api/admin/box/${template._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        toast({
          variant: "destructive",
          title: "Error updating box",
          description: err.error || "Please check your input and try again.",
        });
      } else {
        toast({
          title: "Box updated",
          description: "Your changes have been saved successfully.",
        });
        onOpenChange(false);
        onUpdated(); // trigger parent to refresh the SWR list
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Network error",
        description: err.message || "Unable to update box.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {/* We don’t actually need a separate <SheetTrigger> here because BoxCard calls onOpenChange(true) */}
      <SheetContent className="bg-black/90 border-lime-500/30 text-white w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-lime-300">Edit Box Template</SheetTitle>
          <SheetDescription className="text-lime-300/70">
            Update name, prizes, chance, status, or image for this box.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="space-y-6 mt-6">
          {/* NAME */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-lime-300">
              Template Name
            </Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={onChange}
              required
              placeholder="Season 1 Box"
              className="bg-black/60 border-lime-500/20 focus:border-lime-500/50 text-lime-100"
            />
          </div>

          {/* PRIZES */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="normalPrize" className="text-lime-300">
                Normal Prize
              </Label>
              <Input
                id="normalPrize"
                name="normalPrize"
                type="number"
                value={form.normalPrize}
                onChange={onChange}
                required
                min={0}
                className="bg-black/60 border-lime-500/20 focus:border-lime-500/50 text-lime-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goldenPrize" className="text-lime-300">
                Golden Prize
              </Label>
              <Input
                id="goldenPrize"
                name="goldenPrize"
                type="number"
                value={form.goldenPrize}
                onChange={onChange}
                required
                min={0}
                className="bg-black/60 border-lime-500/20 focus:border-lime-500/50 text-lime-100"
              />
            </div>
          </div>

          {/* CHANCE */}
          <div className="space-y-2">
            <Label htmlFor="goldenChance" className="text-lime-300">
              Golden Chance (0–1)
            </Label>
            <Input
              id="goldenChance"
              name="goldenChance"
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={form.goldenChance}
              onChange={onChange}
              required
              className="bg-black/60 border-lime-500/20 focus:border-lime-500/50 text-lime-100"
            />
            <p className="text-xs text-lime-300/60">
              Current: {(form.goldenChance * 100).toFixed(2)}% chance
            </p>
          </div>

          {/* IMAGE UPLOAD */}
          <div className="space-y-2">
            <Label htmlFor="file" className="text-lime-300">
              Box Image
            </Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="bg-black/60 border-lime-500/20 focus:border-lime-500/50 text-lime-100"
            />
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="mt-2 h-20 w-auto object-contain rounded-lg border border-lime-500/30"
              />
            ) : form.imageUrl ? (
              <img
                src={form.imageUrl}
                alt="Current"
                className="mt-2 h-20 w-auto object-contain rounded-lg border border-lime-500/30"
              />
            ) : null}
          </div>

          {/* ACTIVE TOGGLE */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={form.active}
              onCheckedChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  active: !!checked,
                }))
              }
              className="border-lime-500/50 data-[state=checked]:bg-lime-500 data-[state=checked]:border-lime-500"
            />
            <Label htmlFor="active" className="text-lime-300">
              Active Template
            </Label>
          </div>

          {/* SAVE BUTTON */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-lime-500 hover:bg-lime-600 text-black"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
