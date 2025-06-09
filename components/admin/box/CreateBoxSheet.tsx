// components/CreateBoxTemplateSheet.tsx
"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type BoxFormState = {
  name: string;
  normalPrize: number | "";
  goldenPrize: number | "";
  goldenChance: number | "";
  active: boolean;
  imageUrl: string;
  missionUrl: string;
  missionDesc: string;
  // NEW fields:
  boxType: "normal" | "partner";
  promoCode: string;
};

interface CreateBoxTemplateSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: BoxFormState;
  file: File | null;
  loading: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBoxTypeChange: (value: BoxFormState["boxType"]) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateBoxTemplateSheet({
  isOpen,
  onOpenChange,
  form,
  file,
  loading,
  onChange,
  onFileChange,
  onBoxTypeChange,
  onSubmit,
}: CreateBoxTemplateSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button className="bg-lime-500 hover:bg-lime-600 text-black">
          <Plus className="h-4 w-4 mr-2" />
          Create Box
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-black/95 border-lime-500/30 text-white w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lime-300">Create New Box</SheetTitle>
          <SheetDescription className="text-lime-300/70">
            Configure a new prize box template with normal/golden rewards, an
            optional image, mission requirements, and choose “partner” if you
            want to assign a promo code.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="space-y-6 mt-6">
          {/* ──────────────── Box Type Selector ──────────────── */}
          <div className="space-y-2">
            <Label className="text-lime-300">Box Type</Label>
            <RadioGroup
              value={form.boxType}
              onValueChange={(v) =>
                onBoxTypeChange(v as BoxFormState["boxType"])
              }
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

          {/* ──────────────── Template Name ──────────────── */}
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

          {/* ──────────── Normal & Golden Prizes ──────────── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="normalPrize" className="text-lime-300">
                Normal Prize
              </Label>
              <Input
                id="normalPrize"
                name="normalPrize"
                type="number"
                value={form.normalPrize === "" ? "" : form.normalPrize}
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
                value={form.goldenPrize === "" ? "" : form.goldenPrize}
                onChange={onChange}
                required
                min={0}
                className="bg-black/60 border-lime-500/20 focus:border-lime-500/50 text-lime-100"
              />
            </div>
          </div>

          {/* ──────────────── Golden Chance ──────────────── */}
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
              value={form.goldenChance === "" ? "" : form.goldenChance}
              onChange={onChange}
              required
              className="bg-black/60 border-lime-500/20 focus:border-lime-500/50 text-lime-100"
            />
            <p className="text-xs text-lime-300/60">
              Current:{" "}
              {form.goldenChance === ""
                ? "0.00"
                : (Number(form.goldenChance) * 100).toFixed(2)}
              % chance
            </p>
          </div>

          {/* ──────────────── Box Image Upload ──────────────── */}
          <div className="space-y-2">
            <Label htmlFor="file" className="text-lime-300">
              Box Image
            </Label>
            <Input
              id="file"
              type="file"
              required
              accept="image/*"
              onChange={onFileChange}
              className="bg-black/60 border-lime-500/20 focus:border-lime-500/50 text-lime-100"
            />
            {file && (
              <Image
                src={URL.createObjectURL(file)}
                alt="Preview"
                width={100}
                height={100}
                className="mt-2 h-20 w-auto object-contain rounded-lg border border-lime-500/30"
              />
            )}
          </div>

          {/* ──────────────── Mission URL ──────────────── */}
          <div className="space-y-2">
            <Label htmlFor="missionUrl" className="text-lime-300">
              Mission URL
            </Label>
            <Input
              id="missionUrl"
              name="missionUrl"
              type="url"
              value={form.missionUrl}
              onChange={onChange}
              required
              placeholder="https://twitter.com/..."
              className="bg-black/60 border-lime-500/20 focus:border-lime-500/50 text-lime-100"
            />
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

          {/* ─────────── Submit Button ─────────── */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-lime-500 hover:bg-lime-600 text-black"
          >
            {loading ? "Creating…" : "Create Template"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
