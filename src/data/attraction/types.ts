import { UUID } from "crypto";
import { InitialCountries } from "../general/types";

// enums

export enum BookingTypeEnum {
  ticket = "ticket",
  booking = "booking",
}

export enum CancellationTypeEnum {
  nonRefundable = "nonRefundable",
  freeCancellation = "freeCancellation",
  cancelWithFee = "cancelWithFee",
}

export enum DurationTypeEnum {
  hours = "hours",
  days = "days",
  months = "months",
}

export enum OfferTypeEnum {
  percentage = "percentage",
  flat = "flat",
}

export enum BaseTypeEnum {
  person = "person",
  private = "private",
  hourly = "hourly",
}

export enum ActivityTypeEnum {
  normal = "normal",
  transfer = "transfer",
}
export enum QtnActivityTypeEnum {
  ticket = "ticket",
  transfer = "transfer",
}

export enum TransferTypeEmun {
  without = "without",
  private = "private",
  shared = "shared",
}

export enum OrderStatusExcEnum {
  pending = "pending",
  paid = "paid",
  failed = "failed",
  completed = "completed"
}

// All data in query search in attraction form.
export interface QueryDestinations {
  name: string;
  slug: string;
  _id: UUID | string;
}

export interface Destination {
  _id: UUID | string;
  country: UUID | string;
  name: string;
  slug: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  __v?: number;
  isDeleted: boolean;
  image: string;
}

export interface CategorySearchByDestination {
  categoryName: string;
  slug: string;
}

export interface Category {
  _id: UUID | string;
  categoryName: string;
  description: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  slug: string;
  __v?: number;
  icon: string;
}

export interface QueryAttractions {
  destination: QueryDestinations;
  slug: string;
  title: string;
  _id: UUID | string;
}

// Search By destination attarction interfaces.
export interface ActivitySearchByDestination {
  activityType: string;
  isPrivateTransferAvailable: boolean;
  isSharedTransferAvailable: boolean;
  lowPrice: number;
}

export interface MarkupSearchByDestination {
  activityId: UUID | string;
  adultMarkup: number;
  adultMarkupType: OfferTypeEnum;
  childMarkup: number;
  childMarkupType: OfferTypeEnum;
  createdAt: Date | string;
  infantMarkup: number;
  infantMarkupType: OfferTypeEnum;
  updatedAt: Date | string;
  __v?: number;
  _id: string;
}
export interface PrivateTransferSearchByDestination {
  cost: number;
  maxCapacity: number;
  name: string;
  price: number;
  _id: UUID | string;
}

export interface DestinationSearchByDestination {
  country: UUID | string;
  createdAt: Date | string;
  image?: string;
  isDeleted: boolean;
  name: string;
  slug: string;
  updatedAt: Date | string;
  __v?: number;
  _id: UUID | string;
}

export interface SearchByDestination {
  activity: ActivitySearchByDestination;
  markup: MarkupSearchByDestination;
  privateTransfer: PrivateTransferSearchByDestination;
  category: CategorySearchByDestination;
  destination: DestinationSearchByDestination;
  averageRating: number;
  bookingType: string;
  cancelBeforeTime?: string;
  cancellationFee?: string;
  cancellationType: CancellationTypeEnum;
  duration: number;
  durationType: DurationTypeEnum;
  images: string[];
  isCombo: boolean;
  isOffer: boolean;
  lowPrice: number;
  isPromoCode: boolean;
  offerAmount?: number;
  offerAmountType: OfferTypeEnum;
  slug: string;
  title: string;
  totalReviews: number;
  _id: UUID | string;
}


export interface Blogs {
  title: string;
  body: string;
  thumbnail: string;
  _id: UUID | string;
  category: CategorySearchByDestination;
  createdAt: string;
}

export interface AvailablityExcursion {
  isEnabled: boolean;
  day: string;
  open: string;
  close: string;
  _id: UUID | string;
}

export interface SectionsExcursion {
  title: string;
  body: string;
  _id: UUID | string;
}

export interface ReviewExcursion {
  _id: UUID | string;
  title: string;
  description: string;
  rating: number;
  attraction: UUID | string;
  createdBy: string;
  userName: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  isDelelted: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  __v?: Number;
}

export interface PrivateTransferExcursion {
  name: string;
  maxCapacity: number;
  price: number;
  cost: number;
  _id: UUID | string;
  // additional.
  count: number;
}

export interface VehicleTypeExcursion {
  price: number;
  vehicle: UUID | string;
  _id: UUID | string;
}

export interface FaqsExcursion {
  question: string;
  answer: string;
  _id: UUID | string;
}

export interface ActivityExcursion {
  _id: UUID | string;
  attraction: UUID | string;
  name: string;
  images: string[];
  facilities: string;
  slug: string;
  destination: string;
  adultAgeLimit: number;
  adultPrice: number;
  childAgeLimit: number;
  childPrice: number;
  infantAgeLimit: number;
  infantPrice: number;
  isVat: boolean;
  vat: number;
  base: BaseTypeEnum;
  isTransferAvailable: boolean;
  privateTransferPrice: number;
  sharedTransferPrice: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  __v?: number;
  description: string;
  overview: string;
  inculsionsAndExclusions: string;
  termsAndConditions: string;
  activityType: ActivityTypeEnum;
  isPrivateTransferAvailable: boolean;
  isSharedTransferAvailable: boolean;
  privateTransfers: PrivateTransferExcursion[];
  isQuotation: boolean;
  qtnActivityType: QtnActivityTypeEnum;
  ticketPricing: {
    adultPrice: number;
    childPrice: number;
    sicWithTicketAdultPrice: number;
    sicWithTicketChildPrice: number;
    vehicleType: VehicleTypeExcursion[];
    _id: UUID | string;
  };
  transferPricing: {
    _id: UUID | string;
    vehicleType: VehicleTypeExcursion[];
  };
  carouselPosition: any;
  isCarousel: boolean;
  isPromoCode: boolean;
  promoAmountAdult?: number;
  promoAmountChild?: number;
  promoCode: string;
  markup: {
    _id: string | UUID;
    activityId: UUID | string;
    __v?: number;
    adultMarkup?: number;
    adultMarkupType: OfferTypeEnum;
    childMarkup?: number;
    childMarkupType: OfferTypeEnum;
    createdAt: Date | string;
    infantMarkupType: OfferTypeEnum;
    updatedAt: Date | string;
  };
  lowPrice: number;
  adultlowPrice: number;
  childlowPrice: number;
  infantlowPrice: number;
  offerlowPrice: number;
  hourlyCost: number;
  productId: string;
  productCode: string;
  isApiSync: boolean;

  //adding additional fields to it.
  transferType: TransferTypeEmun;
  vehicles: PrivateTransferExcursion[];
  adultCount: number;
  childCount: number;
  infantCount: number;
  hourCount: number;
  grandTotal: number;
  isChecked: boolean;
  date: Date | string;
  slotsAvailable: TimeSlotExcursion[];
  slot: TimeSlotExcursion;

  // Promotion exist.
  isPromoAdded: boolean;
  appliedPromoAmount: number;
  priceWithoutPromoGrandTotal: number;
}

// Detail attraction page
export interface ExcursionDetails {
  _id: UUID | string;
  title: string;
  bookingType: BookingTypeEnum;
  isCustomDate: boolean;
  startDate?: Date | string;
  endDate?: Date | string;
  availability: AvailablityExcursion[];
  offDates: string[];
  durationType: DurationTypeEnum;
  duration: Number;
  isActive: boolean;
  mapLink: string;
  isOffer: boolean;
  offerAmountType: OfferTypeEnum;
  offerAmount?: number;
  youtubeLink: string;
  images: string[];
  highlights: string | TrustedHTML;
  sections: SectionsExcursion[];
  isApiConnected: boolean;
  connectedApi: UUID | string;
  cancellationType: CancellationTypeEnum;
  cancelBeforeTime?: Date | string;
  cancellationFee?: Date | string;
  isDeleted: boolean;
  isCombo: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  __v?: null;
  bookingPriorDays?: number;
  logo?: string;
  itineraryDescription?: string;
  slug: string;
  destination: Destination;
  category: Category;
  reviews: ReviewExcursion[];
  totalRating: number;
  markup?: number;
  averageRating: number;
  activities: ActivityExcursion[];
  faqs: FaqsExcursion[];
  latitude: number;
  longitude: number;
}

// Excursion timeslot.
export interface TimeSlotExcursion {
  EventID: string;
  EventName: string;
  StartDateTime: Date | string;
  EndDateTime: Date | string;
  ResourceID: string;
  Status: string;
  AdultPrice: number;
  ChildPrice: number;
  Available: string | number;
}

export interface OrderExcursion {
  _id: UUID | string;
  attractionId: string;
  paymentState: string;
  activities: [
    {
      attraction: {
        _id: UUID | string;
        title: string;
        isOffer: boolean;
        offerAmountType: OfferTypeEnum;
        offerAmount: null | number;
        images: string[];
        logo: string;
      };
      bookingType: BookingTypeEnum;
      activity: ActivityExcursion;
      activityType: ActivityTypeEnum;
      date: Date | string;
      adultsCount: number;
      childrenCount: number;
      infantCount: number;
      childActivityPrice: number;
      adultActivityPrice: number;
      infantActivityPrice: number;
      adultActivityTotalPrice: number;
      childActivityTotalPrice: number;
      infantActivityTotalPrice: number;
      adultActivityCost: number;
      childActivityCost: number;
      infantActivityCost: number;
      adultActivityTotalCost: number;
      childActivityTotalCost: number;
      infantActivityTotalCost: number;
      activityTotalPrice: number;
      activityTotalCost: number;
      transferType: TransferTypeEmun;
      sharedTransferPrice: number;
      sharedTransferCost: number;
      sharedTransferTotalPrice: number;
      sharedTransferTotalCost: number;
      drivers: any[];
      privateTransfersTotalPrice: string;
      privateTransfersTotalCost: string;
      adultTickets: any[];
      childTickets: any[];
      infantTickets: any[];
      status: OrderStatusExcEnum;
      isvat: false;
      vatPercentage: number;
      totalVat: number;
      totalCost: number;
      profit: number;
      offerAmount: number;
      totalWithoutOffer: number;
      promoDiscount: number;
      grandTotal: number;
      isRefundAvailable: boolean;
      isRefunded: boolean;
      _id: UUID | string;
      privateTransfers: PrivateTransferExcursion[];
    }
  ];
  transferOrder: {
    _id: string;
    paymentState: string;
    journey: [
      {
        netPrice: number;
        noOfAdults: number;
        noOfChildrens: number;
        transferType: string;
        trips: [
          {
              date: string;
              time: string;
              transfer: string;
              suggestionType: string;
              transferFrom: {
                  _id: string;
                  airportName: string;
                  place: string;
              },
              transferTo: {
                 _id: string;
                  areaCode: string;
                  areaName: string;
                  city: string;
                  state: string;
                  country: string;
                  isDeleted: boolean;
                  createdAt: string;
                  updatedAt: string;
                  __v: number,
                  name: string;
              },
              vehicles: [
                  {
                      price: number;
                      vehicle: {
                          _id: string;
                          name: string;
                          image: string;
                          airportOccupancy: number;
                          normalOccupancy: number;
                          isDeleted: boolean;
                          createdAt: string;
                          updatedAt: string;
                          __v: number;
                          vehicleType: string;
                          vehicleCategoryId: {
                              _id: string;
                              categoryName: string;
                              createdAt:  string;
                              updatedAt: string;
                              __v: number;
                          }
                      },
                      _id: string;
                  }, 
              ]
          }
      ]
      }
    ];
  };
  attractionOrder: {
    activities: [
      {
        attraction: {
          _id: UUID | string;
          title: string;
          isOffer: boolean;
          offerAmountType: OfferTypeEnum;
          offerAmount: null | number;
          images: string[];
          logo: string;
        };
        bookingType: BookingTypeEnum;
        activity: ActivityExcursion;
        activityType: ActivityTypeEnum;
        date: Date | string;
        adultsCount: number;
        childrenCount: number;
        infantCount: number;
        childActivityPrice: number;
        adultActivityPrice: number;
        infantActivityPrice: number;
        adultActivityTotalPrice: number;
        childActivityTotalPrice: number;
        infantActivityTotalPrice: number;
        adultActivityCost: number;
        childActivityCost: number;
        infantActivityCost: number;
        adultActivityTotalCost: number;
        childActivityTotalCost: number;
        infantActivityTotalCost: number;
        activityTotalPrice: number;
        activityTotalCost: number;
        transferType: TransferTypeEmun;
        sharedTransferPrice: number;
        sharedTransferCost: number;
        sharedTransferTotalPrice: number;
        sharedTransferTotalCost: number;
        drivers: any[];
        privateTransfersTotalPrice: string;
        privateTransfersTotalCost: string;
        adultTickets: any[];
        childTickets: any[];
        infantTickets: any[];
        status: OrderStatusExcEnum;
        isvat: false;
        vatPercentage: number;
        totalVat: number;
        totalCost: number;
        profit: number;
        offerAmount: number;
        totalWithoutOffer: number;
        promoDiscount: number;
        grandTotal: number;
        isRefundAvailable: boolean;
        isRefunded: boolean;
        _id: UUID | string;
        privateTransfers: PrivateTransferExcursion[];
      }
    ];
  };
  totalOfferAmount: number;
  totalAmount: number;
  orderStatus: OrderStatusExcEnum;
  isPaid: boolean;
  user: UUID | string;
  name: string;
  email: string;
  phoneNumber: string | number;
  country: InitialCountries;
  referenceNumber: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  __v: number;
}

export interface FiltersType {
  skip: number;
  limit: number;
  category: string[];
  rating: number[];
  duration: string[];
  priceFrom: number;
  priceTo: number;
}
