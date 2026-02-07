"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Briefcase, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle,
  FileText,
  Award,
  Building,
  GraduationCap
} from "lucide-react";
import { uploadProfessionalDocument } from "../action/UserActions";

const ProfessionalVerification = ({ userId, professionalVerification = {} }) => {
  const [selectedDocuments, setSelectedDocuments] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    profession: professionalVerification.profession || "",
    businessName: professionalVerification.businessName || "",
    businessRegistration: professionalVerification.businessRegistration || "",
    licenseNumber: professionalVerification.licenseNumber || "",
    experience: professionalVerification.experience || "",
    description: professionalVerification.description || ""
  });

  const fileInputRefs = {
    businessLicense: useRef(null),
    professionalCertificate: useRef(null),
    proofOfAddress: useRef(null),
    additionalDocument: useRef(null)
  };

  const documentTypes = [
    {
      key: "businessLicense",
      title: "Business License",
      description: "Valid business registration document",
      icon: Building,
      required: true
    },
    {
      key: "professionalCertificate",
      title: "Professional Certificate",
      description: "Professional qualification or certification",
      icon: Award,
      required: true
    },
    {
      key: "proofOfAddress",
      title: "Proof of Address",
      description: "Utility bill or bank statement (last 3 months)",
      icon: FileText,
      required: true
    },
    {
      key: "additionalDocument",
      title: "Additional Document",
      description: "Any other supporting documents",
      icon: FileText,
      required: false
    }
  ];

  const handleFileSelect = (documentType, files) => {
    const file = files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("File too large. Max size is 5MB.");
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setSelectedDocuments(prev => ({
        ...prev,
        [documentType]: {
          file: fileReader.result,
          name: file.name,
          type: file.type
        }
      }));
    };
    fileReader.readAsDataURL(file);
    setError("");
  };

  const handleRemoveDocument = (documentType) => {
    setSelectedDocuments(prev => {
      const newDocs = { ...prev };
      delete newDocs[documentType];
      return newDocs;
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const documents = Object.entries(selectedDocuments).map(([type, doc]) => ({
        type,
        name: doc.name,
        data: doc.file,
        uploadedAt: new Date().toISOString()
      }));

      const verificationData = {
        ...formData,
        documents,
        submittedAt: new Date().toISOString(),
        status: "pending"
      };

      await uploadProfessionalDocument(userId, verificationData);
      // You might want to refresh the page or show success message here
    } catch (err) {
      setError(err.message || "Failed to submit professional verification");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    const status = professionalVerification.status;
    
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified Professional
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Under Review
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Verification Failed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Not Verified
          </Badge>
        );
    }
  };

  const isVerified = professionalVerification.status === "verified";
  const hasPendingSubmission = professionalVerification.status === "pending";

  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Professional Verification
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Verify your professional status to increase trust and unlock premium features
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {isVerified ? (
        /* Verified State */
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900">Professional Verified</h4>
                <p className="text-sm text-green-700 mt-1">
                  Your professional credentials have been verified
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Profession</Label>
              <p className="text-gray-900">{professionalVerification.profession}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Business Name</Label>
              <p className="text-gray-900">{professionalVerification.businessName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">License Number</Label>
              <p className="text-gray-900">{professionalVerification.licenseNumber}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Experience</Label>
              <p className="text-gray-900">{professionalVerification.experience}</p>
            </div>
          </div>
        </div>
      ) : hasPendingSubmission ? (
        /* Pending State */
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-yellow-600" />
              <div>
                <h4 className="font-semibold text-yellow-900">Under Review</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Your professional verification is being reviewed. This typically takes 2-3 business days.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>Submitted documents:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {professionalVerification.documents?.map((doc, index) => (
                <li key={index}>{doc.name}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        /* Form State */
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Professional Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Professional Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profession">Profession *</Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => handleInputChange("profession", e.target.value)}
                  placeholder="e.g., Software Developer, Designer, Consultant"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                  placeholder="Your business or company name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="licenseNumber">Professional License Number</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                  placeholder="Your professional license number"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  placeholder="e.g., 5+ years"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Professional Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your professional background and expertise..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Document Upload */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Required Documents
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentTypes.map((docType) => {
                const Icon = docType.icon;
                const selectedDoc = selectedDocuments[docType.key];
                
                return (
                  <div key={docType.key} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-500" />
                      <Label className="text-sm font-medium">
                        {docType.title} {docType.required && <span className="text-red-500">*</span>}
                      </Label>
                    </div>
                    
                    <p className="text-xs text-gray-500">{docType.description}</p>
                    
                    {selectedDoc ? (
                      <div className="relative">
                        <div className="w-full h-32 border rounded-lg overflow-hidden">
                          <Image
                            src={selectedDoc.file}
                            alt={selectedDoc.name}
                            width={200}
                            height={200}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={() => handleRemoveDocument(docType.key)}
                        >
                          <XCircle className="w-3 h-3" />
                        </Button>
                        <div className="mt-1 text-xs text-gray-600 truncate">
                          {selectedDoc.name}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                        onClick={() => fileInputRefs[docType.key].current?.click()}
                      >
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Click to upload</span>
                        <span className="text-xs text-gray-400">Max 5MB</span>
                      </div>
                    )}
                    
                    <input
                      ref={fileInputRefs[docType.key]}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileSelect(docType.key, e.target.files)}
                      className="hidden"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={loading || Object.keys(selectedDocuments).length < 3}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Submitting..." : "Submit for Verification"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProfessionalVerification;
