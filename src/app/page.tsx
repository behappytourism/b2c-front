import { Metadata, ResolvingMetadata } from "next";
import LandingPage from "./LandingPage";
import { SeoCall } from "./SEOapi";

export async function generateMetadata(
	_params: any, // Removed the parameter since it's not needed
	parent: ResolvingMetadata
): Promise<Metadata> {
	const data = await SeoCall({
		type: "landingPage",
		name: "attractions",
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

const PageHome = () => {
	return <LandingPage />;
};

export default PageHome;
