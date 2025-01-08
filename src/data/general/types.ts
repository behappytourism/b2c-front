import { UUID } from "crypto";
import {
  BookingTypeEnum,
  CategorySearchByDestination,
} from "../attraction/types";

export interface SelectedCurrency {
  isocode: string;
  conversionRate: number;
  flag: string;
}

export interface InitialCountries {
  countryName?: string;
  createdAt?: Date | string;
  flag?: string;
  isDeleted?: boolean;
  isocode?: string;
  phonecode?: string;
  updatedAt?: Date | string;
  __v?: number;
  _id?: UUID | string;
}

export interface InitialAttractionDestiantions {
  country?: string;
  createdAt?: Date | string;
  image?: string;
  isDeleted?: boolean;
  name?: string;
  updatedAt?: Date | string;
  __v?: number;
  _id?: string;
}

export interface InitialCurrencies {
  conversionRate?: number;
  country?: InitialCountries;
  createdAt?: Date | string;
  currencyName?: string;
  currencySymbol?: string;
  isocode?: string;
  updatedAt?: Date | string;
  __v?: number;
  _id?: string;
}

export interface InitialHotelDestinations {
  childSuggestions?: Array<any>;
  cityId?: string;
  cityName?: string;
  clickable?: boolean;
  countryName?: string;
  propertyCount?: number;
  stateName?: string;
  suggestionType?: string;
  _id?: string;
}

export interface User {
  _id: UUID | string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  country: UUID | string;
  balance: number;
  isAffiliate: boolean;
  affiliateCode: number;
}

/// Home api data.
export interface TopAttractions {
  _id: UUID | string;
  destination: {
    name: string;
  };
  title: string;
  category: CategorySearchByDestination;
  bookingType: BookingTypeEnum;
  images: string[];
  slug: string;
  activity: {
    adultPrice: number;
  };
  isPromoCode: boolean;
  totalReviews: number;
  averageReviews: number;
}

export interface BestSellingAttractions {
  _id: UUID | string;
  destination: {
    name: string;
  };
  title: string;
  category: CategorySearchByDestination;
  bookingType: BookingTypeEnum;
  images: string[];
  slug: string;
  activity: {
    adultPrice: number;
  };
  isPromoCode: boolean;
  totalReviews: number;
  averageRating: number;
}

export interface HomeCard {
  title: string;
  description: string;
  backgroundImage: string;
  tag: string;
  url: string;
  isRelativeUrl: boolean;
  _id: UUID | string;
  icon: string;
}

export interface NavLinks {
  name: string;
  link: string;
  isRelativeUrl: boolean;
  _id: UUID | string;
}

export interface Footer {
  title: string;
  navLinks: NavLinks[];
  _id: UUID | string;
}

export interface Heros {
  title: string;
  description: string;
  image: string;
  place: string;
  _id: UUID | string;
}

export interface Blogs {
  title: string;
  body: string;
  thumbnail: string;
  createdAt: string;
  _id: UUID | string;
  category: CategorySearchByDestination;
  slug: string;
  tags?: string[];
}

export interface Home {
  _id?: UUID | string;
  settingsNumber?: number;
  __v?: number;
  bestSellingAttractions?: string[];
  cards?: HomeCard[];
  createdAt?: Date | string;
  footer?: Footer[];
  heroImages?: string[];
  isBestSellingAttractionsSectionEnabled?: boolean;
  isBlogsEnabled?: boolean;
  isTopAttractionsSectionEnabled?: boolean;
  logo?: string;
  topAttractions?: string[];
  updatedAt?: Date | string;
  heroDescription?: string;
  heroTitle?: string;
  email?: string;
  facebookUrl?: string;
  footerDescription?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  tripAdvisorUrl?: string;
  youtubeUrl?: string;
  phoneNumber1?: number;
  phoneNumber2?: number;
  heros?: Heros[];
  recentBlogs?: Blogs[]
}
