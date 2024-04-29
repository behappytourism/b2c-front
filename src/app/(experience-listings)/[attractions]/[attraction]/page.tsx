import { Metadata } from "next";
import AttractionDetails from "./AttractionDetails";

export interface ListingExperiencesDetailPageProps {
  params: { attraction: string };
}

export const metadata: Metadata = {
  title: 'BE HAPPY',
  description: ''
};

function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function capitalizeEachWord(sentence: string) {
  return sentence
    .split(' ')
    .map((word) => capitalizeFirstLetter(word))
    .join(' ');
}

function removeHyphens(attraction: string) {
  return attraction.replace(/-/g, ' ');
}

async function ListingExperiencesDetailPage({
  params,
}: {
  params: { attraction: string };
}) {
  const { attraction } = params;
  const attractionWithoutHyphens = removeHyphens(attraction);



    metadata.title = `Explore ${capitalizeEachWord(attractionWithoutHyphens)} | BE HAPPY`;
  

  return <AttractionDetails attraction={attraction} />;
}

export default ListingExperiencesDetailPage;
