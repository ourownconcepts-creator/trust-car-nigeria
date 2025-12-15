import { motion } from "framer-motion";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import CarCard from "@/components/CarCard";

const FeaturedCars = () => {
  const featuredCars = [
    {
      id: "1",
      title: "Mercedes-Benz GLE 450",
      brand: "Mercedes-Benz",
      model: "GLE 450 4MATIC",
      year: 2023,
      price: 85000000,
      location: "Lagos",
      mileage: "12,000 km",
      fuelType: "Petrol",
      transmission: "Automatic",
      image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&q=80",
      isVerified: true,
      isDealer: true,
      sellerName: "Premium Motors",
    },
    {
      id: "2",
      title: "Toyota Land Cruiser Prado",
      brand: "Toyota",
      model: "Land Cruiser Prado VX",
      year: 2022,
      price: 65000000,
      location: "Abuja",
      mileage: "25,000 km",
      fuelType: "Diesel",
      transmission: "Automatic",
      image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&q=80",
      isVerified: true,
      isDealer: false,
      sellerName: "Chidi O.",
    },
    {
      id: "3",
      title: "BMW X5 xDrive40i",
      brand: "BMW",
      model: "X5 xDrive40i M Sport",
      year: 2023,
      price: 72000000,
      location: "Lagos",
      mileage: "8,500 km",
      fuelType: "Petrol",
      transmission: "Automatic",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80",
      isVerified: true,
      isDealer: true,
      sellerName: "Elite Auto",
    },
    {
      id: "4",
      title: "Range Rover Sport",
      brand: "Land Rover",
      model: "Range Rover Sport HSE",
      year: 2022,
      price: 95000000,
      location: "Port Harcourt",
      mileage: "18,000 km",
      fuelType: "Petrol",
      transmission: "Automatic",
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80",
      isVerified: true,
      isDealer: false,
      sellerName: "Emeka A.",
    },
    {
      id: "5",
      title: "Lexus RX 350",
      brand: "Lexus",
      model: "RX 350 F Sport",
      year: 2023,
      price: 55000000,
      location: "Lagos",
      mileage: "5,200 km",
      fuelType: "Petrol",
      transmission: "Automatic",
      image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80",
      isVerified: true,
      isDealer: true,
      sellerName: "Lexus Lagos",
    },
    {
      id: "6",
      title: "Honda Accord",
      brand: "Honda",
      model: "Accord Sport 2.0T",
      year: 2022,
      price: 18500000,
      location: "Ibadan",
      mileage: "32,000 km",
      fuelType: "Petrol",
      transmission: "Automatic",
      image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&q=80",
      isVerified: true,
      isDealer: false,
      sellerName: "Funke B.",
    },
  ];

  const categories = ["All Cars", "SUVs", "Sedans", "Luxury", "Under ₦20M"];

  return (
    <section className="bg-accent/30 py-20 lg:py-28">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Featured Verified Cars
            </h2>
            <p className="text-muted-foreground">
              Hand-picked, verified listings from trusted sellers
            </p>
          </div>
          <Button variant="outline" className="flex-shrink-0">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {categories.map((category, index) => (
            <button
              key={category}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                index === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Cars Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCars.map((car, index) => (
            <CarCard key={car.id} car={car} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Button size="lg" variant="default" className="group">
            Browse All Verified Cars
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCars;
