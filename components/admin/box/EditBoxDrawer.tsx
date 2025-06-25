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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { X } from "lucide-react";

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
    missionUrl: "",
    missionDesc: "",
    boxType: "normal" as "normal" | "partner",
    promoCode: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [missionUrls, setMissionUrls] = useState<string[]>([""]);

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
        missionUrl: template.missionUrl || "",
        missionDesc: template.missionDesc || "",
        boxType: template.boxType || "normal",
        promoCode: template.promoCode || "",
      });
      setFile(null);

      // Initialize mission URLs
      if (template.missionUrl) {
        setMissionUrls(template.missionUrl.split(","));
      } else {
        setMissionUrls([""]);
      }
    }
  }, [template, isOpen]);

  // Handle simple inputs + checkbox
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      e.target instanceof HTMLInputElement ? e.target.checked : false;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "name" ||
              name === "imageUrl" ||
              name === "missionUrl" ||
              name === "missionDesc" ||
              name === "promoCode"
            ? value
            : Number(value),
    }));
  };

  // Handle box type change
  const onBoxTypeChange = (value: "normal" | "partner") => {
    setForm((prev) => ({
      ...prev,
      boxType: value,
    }));
  };

  // Handle new image file selection
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle individual URL input changes
  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...missionUrls];
    newUrls[index] = value;
    setMissionUrls(newUrls);

    // Update the form's missionUrl with comma-separated string
    const urlString = newUrls.filter((url) => url.trim() !== "").join(",");
    const e = {
      target: {
        name: "missionUrl",
        value: urlString,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(e);
  };

  // Add new URL input field
  const addUrlField = () => {
    setMissionUrls([...missionUrls, ""]);
  };

  // Remove URL input field
  const removeUrlField = (index: number) => {
    const newUrls = missionUrls.filter((_, i) => i !== index);
    setMissionUrls(newUrls);

    // Update form after removal
    const urlString = newUrls.filter((url) => url.trim() !== "").join(",");
    const e = {
      target: {
        name: "missionUrl",
        value: urlString,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(e);
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
        missionUrl: form.missionUrl,
        missionDesc: form.missionDesc,
        boxType: form.boxType,
        promoCode: form.promoCode,
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
      {/* We don't actually need a separate <SheetTrigger> here because BoxCard calls onOpenChange(true) */}
      <SheetContent className="bg-black/90 border-lime-500/30 text-white w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lime-300">Edit Box Template</SheetTitle>
          <SheetDescription className="text-lime-300/70">
            Update name, prizes, chance, status, image, mission requirements,
            and box type for this box.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="space-y-6 mt-6">
          {/* ──────────────── Box Type Selector ──────────────── */}
          <div className="space-y-2">
            <Label className="text-lime-300">Box Type</Label>
            <RadioGroup
              value={form.boxType}
              onValueChange={(v) => onBoxTypeChange(v as "normal" | "partner")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="normal" id="type-normal" />
                <Label
                  htmlFor="type-normal"
                  className="text-lime-300 cursor-pointer"
                >
                  Normal
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="partner" id="type-partner" />
                <Label
                  htmlFor="type-partner"
                  className="text-lime-300 cursor-pointer"
                >
                  Partner
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* ──────────────── If Partner, show Promo Code ──────────────── */}
          {form.boxType === "partner" && (
            <div className="space-y-2">
              <Label htmlFor="promoCode" className="text-lime-300">
                Promo Code
              </Label>
              <Input
                id="promoCode"
                name="promoCode"
                type="text"
                value={form.promoCode}
                onChange={onChange}
                placeholder="e.g. SUMMER2025"
                className="bg-black/60 border-lime-500/20 focus:border-lime-500/50 text-lime-100"
                required={form.boxType === "partner"}
              />
            </div>
          )}

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

          {/* ──────────────── Mission URLs ──────────────── */}
          <div className="space-y-2">
            <Label className="text-lime-300">Mission URLs</Label>
            {missionUrls.map((url, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="bg-black/60 border-lime-500/20 focus:border-lime-500/50 text-lime-100"
                />
                {missionUrls.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeUrlField(index)}
                    variant="outline"
                    className="border-lime-500/20 hover:bg-lime-500/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              onClick={addUrlField}
              variant="outline"
              className="w-full border-lime-500/20 hover:bg-lime-500/10 text-lime-300"
            >
              Add Another URL
            </Button>
          </div>

          {/* ───────── Mission Description ───────── */}
          <div className="space-y-2">
            <Label htmlFor="missionDesc" className="text-lime-300">
              Mission Description
            </Label>
            <Textarea
              id="missionDesc"
              name="missionDesc"
              value={form.missionDesc}
              onChange={onChange}
              required
              placeholder="Ask users to comment on our latest tweet"
              className="bg-black/60 border-lime-500/20 focus:border-lime-500/50 text-lime-100"
            />
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
