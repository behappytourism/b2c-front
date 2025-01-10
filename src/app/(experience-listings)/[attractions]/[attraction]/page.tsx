import { Metadata, ResolvingMetadata } from "next";
import AttractionDetails from "./AttractionDetails";
import { SeoCall } from "@/app/SEOapi";

export interface ListingExperiencesDetailPageProps {
	params: { attraction: string };
}

export async function generateMetadata(
	{ params }: ListingExperiencesDetailPageProps,
	parent: ResolvingMetadata
): Promise<Metadata> {
	// read route params
	const { attraction } = params;

	const data = await SeoCall({
		type: "products",
		name: "attraction",
		slug: attraction,
	});

	const title = (await parent).title;
	const description = (await parent).description;
	const keywords = (await parent).keywords;	

	return {
		title: data?.title ? data?.title : title,
		description: data?.description ? data?.description : description,
		keywords: data?.keywords ? data?.keywords : keywords,
		openGraph: {
			title: data?.title ? data?.title : title,
			description: data?.description ? data?.description : description,
		},
	};
}

function ListingExperiencesDetailPage<ListingExperiencesDetailPageProps>({
	params,
}: {
	params: { attraction: string };
}) {
	const { attraction } = params;
	return <AttractionDetails attraction={attraction} />;
}

export default ListingExperiencesDetailPage;
