import { Metadata, ResolvingMetadata } from "next";
import BlogLandingPage from "./BlogLandingPage";
import { SeoCall } from "@/app/SEOapi";

export async function generateMetadata(
	_params: any,
	parent: ResolvingMetadata
): Promise<Metadata> {
	// read route params

	const data = await SeoCall({
		type: "landingPage",
		name: "blog",
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

function Blog() {
	return <BlogLandingPage />;
}

export default Blog;
