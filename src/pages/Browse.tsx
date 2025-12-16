import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Grid3X3, List, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";

const carMakes = ["Toyota", "Honda", "Mercedes-Benz", "BMW", "Lexus", "Ford", "Hyundai", "Kia", "Nissan", "Volkswagen"];
const locations = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu", "Benin City"];
const yearRange = Array.from({ length: 25 }, (_, i) => (2024 - i).toString());

const mockCars = [
  { id: 1, title: "Toyota Camry 2021", price: 18500000, location: "Lagos", year: "2021", mileage: "35,000 km", image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400", verified: true, featured: true },
  { id: 2, title: "Mercedes-Benz C300 2020", price: 32000000, location: "Abuja", year: "2020", mileage: "28,000 km", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400", verified: true, featured: false },
  { id: 3, title: "Honda Accord 2019", price: 14500000, location: "Lagos", year: "2019", mileage: "45,000 km", image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=400", verified: true, featured: false },
  { id: 4, title: "BMW X5 2022", price: 48000000, location: "Port Harcourt", year: "2022", mileage: "12,000 km", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400", verified: true, featured: true },
  { id: 5, title: "Lexus RX 350 2021", price: 38000000, location: "Lagos", year: "2021", mileage: "22,000 km", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400", verified: true, featured: false },
  { id: 6, title: "Toyota Highlander 2020", price: 28000000, location: "Ibadan", year: "2020", mileage: "38,000 km", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400", verified: true, featured: false },
  { id: 7, title: "Ford Explorer 2021", price: 35000000, location: "Abuja", year: "2021", mileage: "25,000 km", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400", verified: true, featured: false },
  { id: 8, title: "Hyundai Tucson 2022", price: 22000000, location: "Lagos", year: "2022", mileage: "18,000 km", image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400", verified: true, featured: false },
];

const Browse = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    make: "",
    location: "",
    yearFrom: "",
    yearTo: "",
    priceRange: [0, 100000000],
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const FilterPanel = ({ className = "" }: { className?: string }) => (
    <div className={`space-y-6 ${className}`}>
      <div>
        <label className="text-sm font-medium mb-2 block">Make</label>
        <Select value={filters.make} onValueChange={(v) => setFilters({ ...filters, make: v })}>
          <SelectTrigger>
            <SelectValue placeholder="All Makes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Makes</SelectItem>
            {carMakes.map((make) => (
              <SelectItem key={make} value={make.toLowerCase()}>{make}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Location</label>
        <Select value={filters.location} onValueChange={(v) => setFilters({ ...filters, location: v })}>
          <SelectTrigger>
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc.toLowerCase()}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Year</label>
        <div className="grid grid-cols-2 gap-2">
          <Select value={filters.yearFrom} onValueChange={(v) => setFilters({ ...filters, yearFrom: v })}>
            <SelectTrigger>
              <SelectValue placeholder="From" />
            </SelectTrigger>
            <SelectContent>
              {yearRange.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.yearTo} onValueChange={(v) => setFilters({ ...filters, yearTo: v })}>
            <SelectTrigger>
              <SelectValue placeholder="To" />
            </SelectTrigger>
            <SelectContent>
              {yearRange.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-4 block">
          Price Range: {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
        </label>
        <Slider
          value={filters.priceRange}
          onValueChange={(v) => setFilters({ ...filters, priceRange: v })}
          max={100000000}
          step={1000000}
          className="mt-2"
        />
      </div>

      <Button variant="outline" className="w-full" onClick={() => setFilters({ make: "", location: "", yearFrom: "", yearTo: "", priceRange: [0, 100000000] })}>
        <X className="h-4 w-4 mr-2" /> Clear Filters
      </Button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Browse Verified Cars - List Your Car Nigeria</title>
        <meta name="description" content="Browse thousands of verified cars for sale in Nigeria. Filter by make, model, price, and location. Every listing is authentic." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-20">
          {/* Search Header */}
          <div className="bg-primary text-primary-foreground py-12">
            <div className="container-wide">
              <h1 className="text-3xl font-bold mb-6">Find Your Perfect Car</h1>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by make, model, or keyword..."
                    className="pl-12 h-12 bg-background text-foreground"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-40 h-12 bg-background text-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc.toLowerCase()}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="lg" variant="verification" className="h-12 px-8">
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="container-wide py-8">
            <div className="flex gap-8">
              {/* Desktop Filters */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
                  <h2 className="font-semibold mb-4">Filters</h2>
                  <FilterPanel />
                </div>
              </aside>

              {/* Results */}
              <div className="flex-1">
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{mockCars.length}</span> verified cars
                  </p>
                  <div className="flex items-center gap-4">
                    {/* Mobile Filter Button */}
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="lg:hidden">
                          <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left">
                        <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <FilterPanel className="mt-6" />
                      </SheetContent>
                    </Sheet>

                    <Select defaultValue="newest">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="mileage">Lowest Mileage</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="hidden sm:flex border border-border rounded-lg p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Car Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}
                >
                  {mockCars.map((car, index) => (
                    <motion.div
                      key={car.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CarCard {...car} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                <div className="flex justify-center mt-12">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" disabled>Previous</Button>
                    <Button variant="default">1</Button>
                    <Button variant="outline">2</Button>
                    <Button variant="outline">3</Button>
                    <span className="px-2">...</span>
                    <Button variant="outline">12</Button>
                    <Button variant="outline">Next</Button>
                  </div>
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

export default Browse;
