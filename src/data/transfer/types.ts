
export interface TransferExcursion {
    _id: string;
    transferType: string;
    noOfAdults: number;
    noOfChildrens: number;
    pickupSuggestionType: string;
    pickupLocation: string;
    dropOffSuggestionType: string;
    dropOffLocation: string;
    time: string;
    date: string;
    vehicle: {
        price: number;
        name: string;
        count: number;
        vehicleType: string;
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