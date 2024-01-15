import { ListingGalleryImage } from "@/components/listing-image-gallery/utils/types";
import carUtilities1 from "@/images/carUtilities/1.png";
import carUtilities2 from "@/images/carUtilities/2.png";
import carUtilities3 from "@/images/carUtilities/3.png";
import carUtilities4 from "@/images/carUtilities/4.png";
import carUtilities5 from "@/images/carUtilities/5.png";
import carUtilities6 from "@/images/carUtilities/6.png";
import carUtilities7 from "@/images/carUtilities/7.png";
import carUtilities8 from "@/images/carUtilities/8.png";

export const PHOTOS: string[] = [
  "https://images.pexels.com/photos/381292/pexels-photo-381292.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/2526128/pexels-photo-2526128.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/2827753/pexels-photo-2827753.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/1637859/pexels-photo-1637859.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/257851/pexels-photo-257851.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/457418/pexels-photo-457418.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/712618/pexels-photo-712618.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/945443/pexels-photo-945443.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/1054211/pexels-photo-1054211.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/189454/pexels-photo-189454.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/193995/pexels-photo-193995.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/575386/pexels-photo-575386.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  "https://images.pexels.com/photos/248687/pexels-photo-248687.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/326259/pexels-photo-326259.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/2882234/pexels-photo-2882234.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/752615/pexels-photo-752615.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/1210622/pexels-photo-1210622.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/303316/pexels-photo-303316.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/136872/pexels-photo-136872.jpeg?auto=compress&cs=tinysrgb&w=1600",
];

export const includes_demo = [
  { name: "Free cancellation up to 48 hours before pick-up" },
  { name: "Collision Damage Waiver with $214 deductible" },
  { name: "Theft Protection with $19,999 excess" },
  { name: "Unlimited mileage" },
  {
    name: "Car interiors and exteriors cleaned with disinfectant before pick-up",
  },
  { name: "Masks are required at the pick-up location" },
];

export const Amenities_demos = [
  { name: "Include the first and last pages of your valid passport. Make sure the copy is in color and clearly shows your personal details and photo.", icon: carUtilities1 },
  { name: "Provide a passport-sized photograph with a white background. Ensure the image is clear and meets the required specifications.", icon: carUtilities2 },
  { name: "For Nigeria Nationality Required AED 2500/- Security Deposit (Refundable) after Exit", icon: carUtilities3 },
];

export const imageGallery: ListingGalleryImage[] = [...PHOTOS].map(
  (item, index): ListingGalleryImage => {
    return {
      id: index,
      url: item,
    };
  }
);
