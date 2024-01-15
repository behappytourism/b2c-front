import { SelectedCurrency } from "@/data/general/types";

const priceConversion = (
  price: number,
  selectedCurrency: SelectedCurrency,
  showIsocode: boolean = false
): string => {
  if (
    !price ||
    !selectedCurrency?.isocode ||
    !selectedCurrency?.conversionRate
  ) {
    return "0";
  }

  const convertedPrice = (
    Number(price) * selectedCurrency?.conversionRate
  )?.toFixed(2);

  return !showIsocode
    ? convertedPrice
    : `${convertedPrice} ${selectedCurrency?.isocode}`;
};

export default priceConversion;
