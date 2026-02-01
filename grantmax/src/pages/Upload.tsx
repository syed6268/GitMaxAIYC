import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload as UploadIcon, FileText, Link as LinkIcon, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  file: File;
  name: string;
  size: number;
  type: string;
}

const Upload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [foaFile, setFoaFile] = useState<File | null>(null);
  const [foaUrl, setFoaUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).map(file => ({
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).map(file => ({
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const handleFoaFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFoaFile(file);
      setFoaUrl(file.name);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleSubmit = async () => {
    if (!foaFile && !foaUrl.trim()) {
      toast({
        title: "Error",
        description: "Please upload FOA PDF or provide URL",
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one grant package document",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      if (foaFile) {
        formData.append('foaDocument', foaFile);
      } else {
        formData.append('foaUrl', foaUrl);
      }
      
      files.forEach((fileData) => {
        formData.append('grantPackages', fileData.file);
      });

      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      
      toast({
        title: "Success",
        description: "Documents uploaded successfully!",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReadyToSubmit = files.length > 0 && (foaFile !== null || foaUrl.trim().length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">GrantGuard</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Check Your Proposal
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload your grant package and we'll identify compliance issues before submission.
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                1
              </div>
              <span className="text-sm font-medium text-foreground">Upload</span>
            </div>
            <div className="w-12 h-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="text-sm text-muted-foreground">Analyze</span>
            </div>
            <div className="w-12 h-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="text-sm text-muted-foreground">Results</span>
            </div>
          </motion.div>

          {/* Upload Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            {/* FOA URL Input */}
            <div className="space-y-3">
              <Label htmlFor="foa-url" className="text-base font-medium">
                Funding Opportunity Announcement (FOA)
              </Label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="foa-url"
                    type="url"
                    placeholder="Paste Grants.gov or funder URL (e.g., https://grants.gov/...)"
                    value={foaUrl}
                    onChange={(e) => setFoaUrl(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFoaFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 px-4 whitespace-nowrap"
                  >
                    <UploadIcon className="w-4 h-4 mr-2" />
                    Upload PDF
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Paste a URL or upload the FOA PDF directly.
              </p>
            </div>

            {/* File Upload Area */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Grant Package Documents
              </Label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                  ${isDragging 
                    ? "border-accent bg-accent/5" 
                    : "border-border hover:border-accent/50 hover:bg-secondary/30"
                  }
                `}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                    <UploadIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium mb-1">
                      Drag & drop files here, or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports PDF, DOC, DOCX, XLS, XLSX (max 50MB per file)
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Types Helper */}
              <div className="flex flex-wrap gap-2 mt-4">
                {["Proposal Narrative", "Budget", "Biosketches", "Letters of Support", "Facilities"].map((doc) => (
                  <span
                    key={doc}
                    className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground"
                  >
                    {doc}
                  </span>
                ))}
              </div>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3"
              >
                <Label className="text-base font-medium">
                  Uploaded Files ({files.length})
                </Label>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <motion.div
                      key={`${file.name}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-[300px]">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                variant="hero"
                size="xl"
                className="w-full"
                disabled={!isReadyToSubmit || isSubmitting}
                onClick={handleSubmit}
              >
                <CheckCircle2 className="w-5 h-5" />
                {isSubmitting ? "Uploading..." : "Start Compliance Check"}
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Your first proposal check is free. No credit card required.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
