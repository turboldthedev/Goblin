"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface UploadDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  onUploadSuccess: () => void;
}

export default function UploadDialog({
  onUploadSuccess,
  isDialogOpen,
  setIsDialogOpen,
}: UploadDialogProps) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !file) {
      toast({
        title: "Missing fields",
        description: "Please provide both a title and an image to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await axios.post("/api/upload", formData);
      const imageUrl = uploadRes.data.url;

      await axios.post("/api/gallery", { title, imageUrl });

      toast({
        title: "Image Uploaded!",
        description: "Your Goblin image has been successfully added.",
      });

      setIsDialogOpen(false); // close dialog
      setTitle("");
      setFile(null);
      onUploadSuccess(); // refresh gallery
    } catch (error) {
      console.error("Upload failed", error);
      toast({
        title: "Upload failed",
        description: "Something went wrong. Try again later.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="bg-black/90 border border-lime-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-lime-300">Upload New Image</DialogTitle>
          <DialogDescription className="text-lime-300/70">
            Add a new Goblin image to the collection.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpload} className="grid gap-4 py-4">
          <div>
            <Label className="text-lime-300">Title</Label>
            <Input
              placeholder="Image title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Input
              type="file"
              accept="image/*"
              className="cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          {file && (
            <div className="relative mt-4">
              <button
                type="button"
                onClick={() => setFile(null)}
                className="absolute top-10 right-2 z-10 bg-black/70 hover:bg-black/90 border border-lime-500/30 text-lime-300 rounded-full p-1 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <p className="text-lime-300 mb-2 text-sm">Preview:</p>
              <Image
                src={URL.createObjectURL(file)}
                alt="Preview"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg border border-lime-500/30 object-cover"
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={isUploading}
              className="bg-lime-500 hover:bg-lime-600 text-black"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
