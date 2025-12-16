import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { 
  Users, Car, Shield, AlertTriangle, CheckCircle2, XCircle,
  Eye, Search, Filter, Clock, TrendingUp, Activity,
  ChevronRight, MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Logo from "@/components/Logo";

const mockPendingListings = [
  {
    id: 1,
    title: "Honda Accord 2019",
    seller: "John Doe",
    sellerType: "private",
    price: 14500000,
    submittedAt: "2024-01-20 14:30",
    image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=200",
    vin: "1HGBH41JXMN109186",
  },
  {
    id: 2,
    title: "BMW X3 2021",
    seller: "Premium Motors",
    sellerType: "dealer",
    price: 35000000,
    submittedAt: "2024-01-20 12:15",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200",
    vin: "WBXHU7C54N5P12345",
  },
];

const mockPendingVerifications = [
  {
    id: 1,
    name: "Emmanuel Okafor",
    type: "private",
    submittedAt: "2024-01-20 10:00",
    documents: ["ID", "Selfie", "Ownership Proof"],
  },
  {
    id: 2,
    name: "AutoHub Nigeria Ltd",
    type: "dealer",
    submittedAt: "2024-01-19 16:45",
    documents: ["CAC Registration", "Representative ID"],
  },
];

const mockFraudAlerts = [
  {
    id: 1,
    type: "duplicate_vin",
    message: "Duplicate VIN detected: JTDKN3DU5A0123456",
    listing: "Toyota Camry 2021",
    severity: "high",
    time: "1 hour ago",
  },
  {
    id: 2,
    type: "image_similarity",
    message: "Similar images found in multiple listings",
    listing: "Mercedes-Benz C300 2020",
    severity: "medium",
    time: "3 hours ago",
  },
];

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - List Your Car</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-muted/30">
        {/* Admin Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-primary text-primary-foreground p-6 hidden lg:block">
          <div className="mb-8">
            <Logo variant="light" size="md" />
          </div>

          <nav className="space-y-2">
            {[
              { label: "Dashboard", icon: Activity, active: true },
              { label: "Listings", icon: Car, badge: 2 },
              { label: "Verifications", icon: Shield, badge: 2 },
              { label: "Users", icon: Users },
              { label: "Fraud Alerts", icon: AlertTriangle, badge: 2 },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  item.active ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:ml-64 p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage listings, verifications, and monitor fraud</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Pending Listings", value: "12", icon: Car, color: "text-verification", trend: "+3" },
              { label: "Pending Verifications", value: "8", icon: Shield, color: "text-primary", trend: "+2" },
              { label: "Active Users", value: "2,456", icon: Users, color: "text-success", trend: "+12%" },
              { label: "Fraud Alerts", value: "3", icon: AlertTriangle, color: "text-destructive", trend: "-1" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <span className="text-xs text-success flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> {stat.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="listings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="listings" className="relative">
                Pending Listings
                <span className="ml-2 bg-verification text-verification-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {mockPendingListings.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="verifications" className="relative">
                Verifications
                <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {mockPendingVerifications.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="fraud" className="relative">
                Fraud Alerts
                <span className="ml-2 bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {mockFraudAlerts.length}
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Pending Listings */}
            <TabsContent value="listings" className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {mockPendingListings.length} listings awaiting review
                </p>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-high">Price: High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {mockPendingListings.map((listing) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-48 h-40 md:h-auto bg-muted">
                      <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-4 md:p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{listing.title}</h3>
                          <p className="text-xl font-bold text-primary">{formatPrice(listing.price)}</p>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          {listing.sellerType}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                        <div>
                          <span className="font-medium text-foreground">Seller:</span> {listing.seller}
                        </div>
                        <div>
                          <span className="font-medium text-foreground">VIN:</span> {listing.vin}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> Submitted: {listing.submittedAt}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button size="sm" className="bg-success hover:bg-success/90">
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" /> Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            {/* Verifications */}
            <TabsContent value="verifications" className="space-y-4">
              {mockPendingVerifications.map((verification) => (
                <motion.div
                  key={verification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{verification.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="capitalize">{verification.type}</Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {verification.submittedAt}
                          </span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Request More Info</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">Submitted Documents:</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {verification.documents.map((doc) => (
                        <Badge key={doc} variant="outline">{doc}</Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-success hover:bg-success/90">
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Verify
                      </Button>
                      <Button size="sm" variant="destructive">
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" /> Review Docs
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            {/* Fraud Alerts */}
            <TabsContent value="fraud" className="space-y-4">
              {mockFraudAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl border p-6 ${
                    alert.severity === "high"
                      ? "bg-destructive/10 border-destructive/20"
                      : "bg-verification/10 border-verification/20"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <AlertTriangle
                      className={`h-6 w-6 flex-shrink-0 ${
                        alert.severity === "high" ? "text-destructive" : "text-verification"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={alert.severity === "high" ? "destructive" : "secondary"}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{alert.time}</span>
                      </div>
                      <p className="font-medium mb-1">{alert.message}</p>
                      <p className="text-sm text-muted-foreground">Related: {alert.listing}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Investigate <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default Admin;
