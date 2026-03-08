import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SEOHead, BreadcrumbSchema, getBreadcrumbsFromPath } from "@/components/seo";
import { motion } from "framer-motion";
import { 
  Upload, Car, FileText, Shield, CheckCircle2, ChevronRight, 
  Camera, X, AlertCircle, Info, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useVerification } from "@/hooks/useVerification";
import { useCarListings } from "@/hooks/useCarListings";
import { toast } from "sonner";

const steps = [
  { id: 1, title: "Car Details", icon: Car },
  { id: 2, title: "Photos", icon: Camera },
  { id: 3, title: "Verification", icon: Shield },
  { id: 4, title: "Review", icon: FileText },
];

const carMakes = ["Toyota", "Honda", "Mercedes-Benz", "BMW", "Lexus", "Ford", "Hyundai", "Kia", "Nissan", "Volkswagen"];
const yearRange = Array.from({ length: 25 }, (_, i) => (2024 - i).toString());
const transmissions = ["Automatic", "Manual"];
const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric"];
const conditions = ["Excellent", "Good", "Fair"];

const SellCar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    verification, 
    isVerified, 
    isPending, 
    uploading: verificationUploading,
    uploadDocument,
    uploadSelfie,
    submitVerification 
  } = useVerification();
  const { createListing, uploading: listingUploading } = useCarListings();

  const [currentStep, setCurrentStep] = useState(1);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const documentInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    transmission: "",
    fuelType: "",
    condition: "",
    price: "",
    vin: "",
    description: "",
    location: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      
      setImageFiles([...imageFiles, ...newFiles].slice(0, 10));
      setImagePreviews([...imagePreviews, ...newPreviews].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
      const result = await uploadDocument(file);
      if (result) {
        setDocumentUrl(result.url);
        toast.success("Document uploaded successfully");
      }
    }
  };

  const handleSelfieUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelfieFile(file);
      const result = await uploadSelfie(file);
      if (result) {
        setSelfieUrl(result.url);
        toast.success("Selfie uploaded successfully");
      }
    }
  };

  const handleVerificationSubmit = async () => {
    if (!documentUrl || !selfieUrl) {
      toast.error("Please upload both documents");
      return;
    }

    const success = await submitVerification(documentUrl, selfieUrl);
    if (success) {
      setCurrentStep(4);
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.make || !formData.model || !formData.year || !formData.mileage ||
            !formData.transmission || !formData.fuelType || !formData.condition ||
            !formData.price || !formData.vin || !formData.location) {
          toast.error("Please fill in all required fields");
          return false;
        }
        if (formData.vin.length !== 17) {
          toast.error("VIN must be exactly 17 characters");
          return false;
        }
        return true;
      case 2:
        if (imageFiles.length < 1) {
          toast.error("Please upload at least one photo");
          return false;
        }
        return true;
      case 3:
        if (!isVerified && !isPending) {
          toast.error("Please complete verification first");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3 && !isVerified && !isPending) {
        handleVerificationSubmit();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setSubmitting(true);
    try {
      const result = await createListing(
        {
          title: `${formData.make} ${formData.model} ${formData.year}`,
          make: formData.make,
          model: formData.model,
          year: parseInt(formData.year),
          mileage: parseInt(formData.mileage),
          transmission: formData.transmission,
          fuel_type: formData.fuelType,
          condition: formData.condition,
          price: parseFloat(formData.price),
          vin: formData.vin,
          description: formData.description,
          location: formData.location,
        },
        imageFiles
      );

      if (result) {
        navigate("/dashboard");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Make *</Label>
                <Select value={formData.make} onValueChange={(v) => setFormData({ ...formData, make: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select make" />
                  </SelectTrigger>
                  <SelectContent>
                    {carMakes.map((make) => (
                      <SelectItem key={make} value={make}>{make}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Model *</Label>
                <Input
                  placeholder="e.g., Camry, Accord, C300"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Year *</Label>
                <Select value={formData.year} onValueChange={(v) => setFormData({ ...formData, year: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearRange.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Mileage (km) *</Label>
                <Input
                  type="number"
                  placeholder="e.g., 35000"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Transmission *</Label>
                <Select value={formData.transmission} onValueChange={(v) => setFormData({ ...formData, transmission: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissions.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fuel Type *</Label>
                <Select value={formData.fuelType} onValueChange={(v) => setFormData({ ...formData, fuelType: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Condition *</Label>
                <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price (₦) *</Label>
                <Input
                  type="number"
                  placeholder="e.g., 18500000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                VIN / Chassis Number *
                <span className="inline-flex items-center text-xs text-muted-foreground">
                  <Info className="h-3 w-3 mr-1" /> Hidden from buyers
                </span>
              </Label>
              <Input
                placeholder="Enter 17-character VIN"
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
                maxLength={17}
              />
              <p className="text-xs text-muted-foreground">
                VIN is required to prevent duplicate listings and protect buyers.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Location *</Label>
              <Input
                placeholder="e.g., Lagos, Ikeja"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your car's condition, features, service history..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-muted/50 border-2 border-dashed border-border rounded-xl p-8 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="font-medium mb-1">Upload Photos</p>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to upload (max 10 photos)
                </p>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        Main Photo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="bg-accent/50 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Camera className="h-4 w-4" /> Photo Guidelines
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Include exterior shots from all angles</li>
                <li>• Show interior, dashboard, and seats</li>
                <li>• Capture any damage or wear clearly</li>
                <li>• Use good lighting and avoid blurry photos</li>
              </ul>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {isVerified ? (
              <div className="bg-success/10 border border-success/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-8 w-8 text-success flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Already Verified!</h3>
                    <p className="text-muted-foreground">
                      Your account is verified. You can proceed to submit your listing.
                    </p>
                  </div>
                </div>
              </div>
            ) : isPending ? (
              <div className="bg-verification/10 border border-verification/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 text-verification flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Verification Pending</h3>
                    <p className="text-muted-foreground mb-4">
                      Your verification is under review. You can proceed to submit your listing, 
                      and it will go live once your verification is approved.
                    </p>
                    <Badge variant="secondary">Under Review</Badge>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-verification/10 border border-verification/20 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <Shield className="h-8 w-8 text-verification flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Seller Verification Required</h3>
                      <p className="text-muted-foreground">
                        To maintain trust on our platform, we require all sellers to verify their identity before listing.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Required Documents</h4>
                  
                  <input
                    type="file"
                    ref={documentInputRef}
                    accept="image/*,.pdf"
                    onChange={handleDocumentUpload}
                    className="hidden"
                  />
                  <div 
                    className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                      documentUrl ? "border-success bg-success/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => documentInputRef.current?.click()}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          documentUrl ? "bg-success/20" : "bg-muted"
                        }`}>
                          {documentUrl ? (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          ) : (
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Government-issued ID</p>
                          <p className="text-sm text-muted-foreground">
                            {documentFile ? documentFile.name : "NIN, Driver's License, or International Passport"}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" disabled={verificationUploading}>
                        {verificationUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload"}
                      </Button>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={selfieInputRef}
                    accept="image/*"
                    onChange={handleSelfieUpload}
                    className="hidden"
                  />
                  <div 
                    className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                      selfieUrl ? "border-success bg-success/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => selfieInputRef.current?.click()}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          selfieUrl ? "bg-success/20" : "bg-muted"
                        }`}>
                          {selfieUrl ? (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          ) : (
                            <Camera className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Selfie Verification</p>
                          <p className="text-sm text-muted-foreground">
                            {selfieFile ? selfieFile.name : "Take a photo holding your ID"}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" disabled={verificationUploading}>
                        {verificationUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Capture"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Your documents are securely stored and only used for verification purposes. 
                      We never share your personal information with third parties.
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-success/10 border border-success/20 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="h-8 w-8 text-success" />
                <div>
                  <h3 className="font-semibold text-lg">Ready for Review</h3>
                  <p className="text-muted-foreground">Your listing will be reviewed by our team within 24 hours.</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="aspect-video bg-muted">
                {imagePreviews[0] && <img src={imagePreviews[0]} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  {formData.make} {formData.model} {formData.year}
                </h2>
                <p className="text-2xl font-bold text-primary mb-4">
                  ₦{Number(formData.price).toLocaleString()}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Mileage:</span> {formData.mileage} km
                  </div>
                  <div>
                    <span className="text-muted-foreground">Transmission:</span> {formData.transmission}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fuel Type:</span> {formData.fuelType}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span> {formData.location}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium mb-2">What happens next?</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs flex-shrink-0">1</span>
                  Our team reviews your listing and documents
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs flex-shrink-0">2</span>
                  You'll receive an email once approved
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs flex-shrink-0">3</span>
                  Your car goes live on the marketplace
                </li>
              </ul>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Sell Your Car - List Your Car Nigeria</title>
        <meta name="description" content="Sell your car to verified buyers in Nigeria. Create a listing, get verified, and connect with serious buyers." />
      </Helmet>

      <div className="min-h-screen bg-muted/30">
        <Navbar />

        <main className="pt-20 pb-12">
          <div className="container-wide py-8">
            {/* Progress Steps */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          currentStep >= step.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {currentStep > step.id ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <step.icon className="h-5 w-5" />
                        )}
                      </div>
                      <span className={`text-xs mt-2 ${
                        currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-full h-1 mx-4 hidden md:block ${
                        currentStep > step.id ? "bg-primary" : "bg-muted"
                      }`} style={{ width: "80px" }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-xl border border-border p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6">{steps[currentStep - 1].title}</h2>
                
                {renderStep()}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    disabled={currentStep === 1}
                  >
                    Back
                  </Button>

                  {currentStep < 4 ? (
                    <Button onClick={handleNext} disabled={verificationUploading}>
                      {currentStep === 3 && !isVerified && !isPending 
                        ? "Submit Verification" 
                        : "Continue"
                      }
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit} 
                      disabled={submitting || listingUploading}
                    >
                      {submitting || listingUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Listing"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SellCar;
