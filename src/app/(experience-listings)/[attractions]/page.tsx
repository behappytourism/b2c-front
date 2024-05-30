import React, { FC } from "react";
import SectionHeroArchivePage from "@/app/(server-components)/SectionHeroArchivePage";
import { Metadata, ResolvingMetadata } from "next";
import AttractionListing from "./AttractionListing";
import { SeoCall } from "@/app/SEOapi";
import Page404 from "@/app/not-found";

export interface ListingExperiencesPageProps {
	params: { attractions: string };
}

export async function generateMetadata(
	{ params }: ListingExperiencesPageProps,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const { attractions } = params;

	const data = await SeoCall({
		type: "products",
		name: "attraction",
		slug: attractions,
	});

	const title = (await parent).title;
	const description = (await parent).description;
	const keywords = (await parent).keywords;

	return {
		title: data?.title ? data.title : title,
		description: data?.description ? data.description : description,
		keywords: data?.keywords ? data.keywords : keywords,
		openGraph: {
			title: data?.title ? data?.title : title,
			description: data?.description ? data?.description : description,
		},
	};
}

const ListingExperiencesPage: FC<ListingExperiencesPageProps> = ({
	params,
}) => {
	const { attractions } = params;

	const validAttractions = [
		"sharjah",
		"dubai",
		"fujairah",
		"oman",
		"abu-dhabi",
		"ras-al-khaimah",
		"ajman",
		"hatta",
	];

	if (!validAttractions.includes(attractions)) {
		return <Page404 />;
	}

	return (
		<>
			{/* <div className="">
        <SectionHeroArchivePage
          currentPage="Experiences"
          currentTab="Experiences"
          className="hidden md:block lg:block pt-10 lg:pt-16 lg:pb-16 "
        />
      </div> */}

			<AttractionListing attractions={attractions} />
		</>
	);
};

export default ListingExperiencesPage;
