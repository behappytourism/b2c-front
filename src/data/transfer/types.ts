
export interface TransferExcursion {
    _id: string;
    error: string;
    transferType: string;
    noOfAdults: number;
    noOfChildrens: number;
    pickupDate: string;
    pickupTime: string;
    pickupSuggestionType: string;
    pickupLocation: string;
    pickupLocationId: string;
    dropOffSuggestionType: string;
    dropOffLocation: string;
    dropOffLocationId: string;
    time: string;
    date: string;
    returnDate: string;
    returnTime: string;
    vehicle: {
        price: number;
        name: string;
        count: number;
        vehicleType: string;
        vehicleId: string;
    }
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



  
export interface TransferCart {
    trips: [
        {
            _id: string;
            date: string;
            time: string;
            noOfAdults: number;
            returnTime: string;
            returnDate: string;
            noOfChildrens: number;
            transferType: string;
            suggestionType: string;
            transferFrom: {
                _id: string;
                airportName: string;
                place: string;
                pickupSuggestionType: string
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
                dropOffSuggestionType: string;
            },
            returnVehicle: any[]
            vehicles: any[]
        }
    ]
  }