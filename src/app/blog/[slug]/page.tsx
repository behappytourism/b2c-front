import { Metadata, ResolvingMetadata } from "next";
import SlugDetailPage from "./SlugDetailPage";
import { SeoCall } from "@/app/SEOapi";

export interface BlogDetailPageProps {
	params: { slug: string };
}

export async function generateMetadata(
	{ params }: BlogDetailPageProps,
	parent: ResolvingMetadata
): Promise<Metadata> {
	// read route params
	const { slug } = params;

	const data = await SeoCall({
		type: "products",
		name: "blog",
		slug: slug,
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

function BlogDetail({ params }: { params: { slug: string } }) {
	const { slug } = params;
	return <SlugDetailPage slug={slug} />;
}

export default BlogDetail;
