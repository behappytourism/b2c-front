import { Metadata, ResolvingMetadata } from "next";
import StandalonePage from "./StandalonePage";
import { SeoCall } from "@/app/SEOapi";

export interface StandAlonePageProps {
	params: { _id: string };
}

export async function generateMetadata(
	{ params }: StandAlonePageProps,
	parent: ResolvingMetadata
): Promise<Metadata> {
	// read route params
	const { _id } = params;
	const data = await SeoCall({
		type: "products",
		name: "stand-alone",
		slug: _id,
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

const page = () => {
	return <StandalonePage />;
};

export default page;
