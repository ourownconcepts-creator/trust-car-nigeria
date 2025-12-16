import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Car, Eye, MessageCircle, Heart, Plus, Settings, User, 
  Shield, AlertCircle, CheckCircle2, Clock, TrendingUp,
  ChevronRight, MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const mockListings = [
  {
    id: 1,
    title: "Toyota Camry 2021",
    price: 18500000,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=200",
    status: "active",
    views: 245,
    inquiries: 12,
    saves: 8,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    title: "Honda Accord 2019",
    price: 14500000,
    image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=200",
    status: "pending",
    views: 0,
    inquiries: 0,
    saves: 0,
    createdAt: "2024-01-20",
  },
];

const mockMessages = [
  {
    id: 1,
    from: "John D.",
    car: "Toyota Camry 2021",
    message: "Is this car still available? I'm interested in viewing it this weekend.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    from: "Aisha M.",
    car: "Toyota Camry 2021",
    message: "What's the lowest price you can accept?",
    time: "5 hours ago",
    unread: true,
  },
  {
    id: 3,
    from: "Emmanuel O.",
    car: "Toyota Camry 2021",
    message: "Thank you for the information. I'll get back to you.",
    time: "1 day ago",
    unread: false,
  },
];

const Dashboard = () => {
  const [verificationStatus] = useState<"pending" | "verified" | "incomplete">("verified");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "pending":
        return <Badge className="bg-verification text-verification-foreground">Pending Review</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - List Your Car</title>
        <meta name="description" content="Manage your car listings, messages, and profile on List Your Car." />
      </Helmet>

      <div className="min-h-screen bg-muted/30">
        <Navbar />

        <main className="pt-20 pb-12">
          <div className="container-wide py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold">Welcome back, John!</h1>
                <p className="text-muted-foreground">Manage your listings and connect with buyers</p>
              </div>
              <Link to="/sell">
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> List a Car
                </Button>
              </Link>
            </div>

            {/* Verification Banner */}
            {verificationStatus === "incomplete" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-verification/10 border border-verification/20 rounded-xl p-4 mb-8"
              >
                <div className="flex items-center gap-4">
                  <AlertCircle className="h-6 w-6 text-verification flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">Complete your verification</p>
                    <p className="text-sm text-muted-foreground">Verify your identity to start listing cars</p>
                  </div>
                  <Button variant="verification" size="sm">
                    Verify Now <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Active Listings", value: "1", icon: Car, color: "text-primary" },
                { label: "Total Views", value: "245", icon: Eye, color: "text-success" },
                { label: "Inquiries", value: "12", icon: MessageCircle, color: "text-verification" },
                { label: "Saved by Buyers", value: "8", icon: Heart, color: "text-destructive" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl border border-border p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Main Content */}
            <Tabs defaultValue="listings" className="space-y-6">
              <TabsList>
                <TabsTrigger value="listings">My Listings</TabsTrigger>
                <TabsTrigger value="messages" className="relative">
                  Messages
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    2
                  </span>
                </TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="listings" className="space-y-4">
                {mockListings.length === 0 ? (
                  <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No listings yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first listing to start selling</p>
                    <Link to="/sell">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" /> List Your Car
                      </Button>
                    </Link>
                  </div>
                ) : (
                  mockListings.map((listing) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card rounded-xl border border-border overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-48 h-40 md:h-auto bg-muted">
                          <img
                            src={listing.image}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4 md:p-6">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{listing.title}</h3>
                              <p className="text-xl font-bold text-primary">{formatPrice(listing.price)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(listing.status)}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Edit Listing</DropdownMenuItem>
                                  <DropdownMenuItem>Mark as Sold</DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-muted-foreground mt-4">
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" /> {listing.views} views
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" /> {listing.inquiries} inquiries
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4" /> {listing.saves} saves
                            </span>
                          </div>

                          {listing.status === "pending" && (
                            <div className="flex items-center gap-2 mt-4 text-sm text-verification">
                              <Clock className="h-4 w-4" />
                              Under review - typically takes 24 hours
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="messages" className="space-y-4">
                {mockMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-card rounded-xl border p-4 cursor-pointer hover:border-primary/50 transition-colors ${
                      msg.unread ? "border-primary/30 bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{msg.from}</p>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">Re: {msg.car}</p>
                        <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                      </div>
                      {msg.unread && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="profile">
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">John Doe</h2>
                      <p className="text-muted-foreground">john.doe@example.com</p>
                      <div className="flex items-center gap-2 mt-1">
                        {verificationStatus === "verified" ? (
                          <Badge className="bg-success text-success-foreground">
                            <Shield className="h-3 w-3 mr-1" /> Verified Seller
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" /> Verification Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span>Personal Information</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <span>Verification Documents</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 text-muted-foreground" />
                        <span>Account Settings</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
