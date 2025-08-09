import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlassmorphismCard from "@/components/ui/glassmorphism-card";

interface DocumentAnalyzerProps {
  dealId: string;
}

export default function DocumentAnalyzer({ dealId }: DocumentAnalyzerProps) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);

  const { data: documents, isLoading } = useQuery({
    queryKey: ["/api/documents", dealId],
    enabled: !!dealId,
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents", dealId] });
      setSelectedFile(null);
      setDocumentType("");
      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded and is being analyzed by AI.",
      });
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !documentType) {
      toast({
        title: "Missing Information",
        description: "Please select a file and document type before uploading.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("document", selectedFile);
    formData.append("dealId", dealId);
    formData.append("documentType", documentType);

    uploadMutation.mutate(formData);
  };

  const getAnalysisStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success-100 text-success-800";
      case "processing": return "bg-gold-100 text-gold-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  const getAnalysisStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return "fas fa-check-circle";
      case "processing": return "fas fa-clock";
      case "failed": return "fas fa-exclamation-circle";
      default: return "fas fa-hourglass-start";
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Document Analyzer Header */}
      <GlassmorphismCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-poppins text-xl font-semibold text-primary-900 mb-2">AI Document Analyzer</h3>
            <p className="text-slate-600">Upload your financial documents for automated analysis and red-flag detection</p>
          </div>
          <div className="flex items-center space-x-2 text-success-600">
            <i className="fas fa-shield-alt"></i>
            <span className="text-sm font-medium">Bank-level encryption</span>
          </div>
        </div>

        {/* Upload Areas */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              dragActive 
                ? "border-primary-400 bg-primary-50" 
                : "border-slate-300 hover:border-primary-400 hover:bg-slate-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
            data-testid="dropzone-upload"
          >
            <i className="fas fa-cloud-upload-alt text-4xl text-slate-400 mb-4"></i>
            <h4 className="font-medium text-slate-700 mb-2">Upload Documents</h4>
            <p className="text-sm text-slate-500 mb-4">
              Financial statements, tax returns, legal documents
            </p>
            {selectedFile ? (
              <div className="bg-primary-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <i className="fas fa-file text-primary-600"></i>
                  <span className="text-sm text-primary-800 font-medium">{selectedFile.name}</span>
                </div>
                <div className="text-xs text-primary-600 mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 mb-4">Drag and drop files here or click to browse</p>
            )}
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileInput}
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              data-testid="input-file-upload"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Document Type</label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger data-testid="select-document-type">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial_statement">Financial Statement</SelectItem>
                  <SelectItem value="tax_return">Tax Return</SelectItem>
                  <SelectItem value="legal_document">Legal Document</SelectItem>
                  <SelectItem value="operational_doc">Operational Document</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !documentType || uploadMutation.isPending}
              className="w-full bg-primary-500 hover:bg-primary-600"
              data-testid="button-upload-document"
            >
              {uploadMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="fas fa-upload mr-2"></i>
                  Upload & Analyze
                </>
              )}
            </Button>

            <div className="text-xs text-slate-500 space-y-1">
              <p>• Supported formats: PDF, DOC, DOCX, XLS, XLSX</p>
              <p>• Maximum file size: 10MB</p>
              <p>• Analysis typically takes 1-3 minutes</p>
            </div>
          </div>
        </div>

        {/* AI Analysis Results */}
        {documents && documents.some((doc: any) => doc.aiAnalysisStatus === "completed") && (
          <div className="bg-gradient-to-r from-success-50 to-primary-50 rounded-xl border border-success-200 p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-check text-white text-sm"></i>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-success-800 mb-2">AI Analysis Complete</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm mb-3">
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="font-medium text-success-700">Financial Health</div>
                    <div className="text-success-600">Strong Performance ↗</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="font-medium text-success-700">Risk Assessment</div>
                    <div className="text-success-600">Low Risk Profile</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="font-medium text-success-700">Valuation Confidence</div>
                    <div className="text-success-600">High Confidence</div>
                  </div>
                </div>
                <Button 
                  size="sm"
                  className="bg-success-500 hover:bg-success-600"
                  data-testid="button-view-analysis"
                >
                  View Detailed Report
                </Button>
              </div>
            </div>
          </div>
        )}
      </GlassmorphismCard>

      {/* Document List */}
      <GlassmorphismCard className="p-6">
        <h3 className="font-poppins text-xl font-semibold text-primary-900 mb-6">Uploaded Documents</h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : documents && documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <i className="fas fa-file-alt text-slate-600"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-900" data-testid={`text-doc-name-${doc.id}`}>
                      {doc.fileName}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-slate-500">
                      <span>{doc.documentType?.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                      <span>•</span>
                      <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge className={getAnalysisStatusColor(doc.aiAnalysisStatus)}>
                    <i className={`${getAnalysisStatusIcon(doc.aiAnalysisStatus)} mr-1`}></i>
                    {doc.aiAnalysisStatus}
                  </Badge>
                  
                  {doc.aiAnalysisStatus === "completed" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      data-testid={`button-view-doc-${doc.id}`}
                    >
                      <i className="fas fa-eye mr-2"></i>
                      View Analysis
                    </Button>
                  )}
                  
                  {doc.riskFlags && doc.riskFlags.length > 0 && (
                    <Badge variant="destructive">
                      <i className="fas fa-flag mr-1"></i>
                      {doc.riskFlags.length} Risk Flag{doc.riskFlags.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <i className="fas fa-file-upload text-4xl text-slate-400 mb-4"></i>
            <h4 className="font-semibold text-slate-700 mb-2">No documents uploaded yet</h4>
            <p className="text-slate-500">
              Upload your financial documents to get started with AI-powered analysis
            </p>
          </div>
        )}
      </GlassmorphismCard>
    </div>
  );
}
