"use client";

import { Blogs } from "@/data/general/types";
import { format } from "date-fns";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

export interface BlogDetailPageSectionProps {
	slug: string;
}

const SlugDetailPage: FC<BlogDetailPageSectionProps> = ({ slug }) => {
	const [blogResponse, setBlogResponse] = useState<Blogs>();
	const [isLoading, setIsLoading] = useState<Boolean>(false);

	useEffect(() => {
		async function getBlogDetailsData() {
			try {
				setIsLoading(true);
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/blogs/single/${slug}`,
					{
						next: { revalidate: 10 },
					}
				);
				if (!response.ok) {
					setIsLoading(false);

					return;
				}
				setBlogResponse(await response.json());
				setIsLoading(false);
			} catch (err: any) {
				console.log(err, "blog-data");
				setIsLoading(false);
			}
		}
		getBlogDetailsData();
	}, []);

	useEffect(() => {
		const loadDetailSchema = async () => {
			const context = {
				"@context": "https://schema.org",
				"@type": "BlogPosting",
				name: process.env.NEXT_PUBLIC_TITLE_NAME,
				url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/blog/${blogResponse?.slug}`,
				datePublished: blogResponse?.createdAt,
				mainEntityOfPage: {
					"@type": "WebPage",
					"@id": `${process.env.NEXT_PUBLIC_CLIENT_URL}/blog/${blogResponse?.slug}`,
				},
				headline: blogResponse?.title,
				image: [
					`${process.env.NEXT_PUBLIC_SERVER_URL}${blogResponse?.thumbnail}`,
				],
				keywords: blogResponse?.tags,
				description: blogResponse?.body,
				publisher: {
					"@type": "Organization",
					name: process.env.NEXT_PUBLIC_TITLE_NAME,
					logo: {
						"@type": "ImageObject",
						url: process.env.NEXT_PUBLIC_COMPANY_LOGO,
					},
				},
			};

			const script = document.createElement("script");
			script.type = "application/ld+json";
			script.innerHTML = JSON.stringify(context);
			script.id = "blog";
			document.head.appendChild(script);
		};

		loadDetailSchema();

		return () => {
			// Clean up script when component unmounts
			const schemaScript = document.querySelector('script[id="blog"]');
			if (schemaScript) {
				schemaScript.remove();
			}
		};
	}, [blogResponse]);

	const loadingComponent = () => {
		return (
			<div
				role="status"
				className="w-full p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700"
			>
				<div className="flex items-center justify-center h-80 mb-4 bg-gray-300 rounded dark:bg-gray-700">
					<svg
						className="w-10 h-10 text-gray-200 dark:text-gray-600"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 16 20"
					>
						<path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
						<path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
					</svg>
				</div>
				<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
				<div className="flex items-center mt-4">
					<svg
						className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
					</svg>
					<div>
						<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
						<div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
					</div>
				</div>
			</div>
		);
	};
	return (
		<div className="lg:max-w-screen-lg lg:mx-auto py-10 mx-2">
			<div className="">
				{!isLoading ? (
					<div className="">
						<div className="w-full space-y-5">
							<div className="rounded-2xl overflow-hidden md:h-[30em]">
								{blogResponse?.thumbnail ? (
									<Image
										src={
											process.env.NEXT_PUBLIC_CDN_URL +
											blogResponse?.thumbnail!
										}
										alt={blogResponse?.title || ""}
										className="rounded-2xl w-full h-full"
										width={800}
										height={400}
									/>
								) : (
									""
								)}
							</div>
							<div className="">
								<h1 className="lg:text-3xl text-2xl font-medium text-darktext ">
									{blogResponse?.title}{" "}
								</h1>
							</div>
							<div className="flex justify-between items-center">
								<div className="flex space-x-2 items-center">
									<span className="">
										<div className="">
											<p className="text-bluetrans font-mono text-lg ">
												{blogResponse?.createdAt
													? format(
															new Date(
																blogResponse?.createdAt
															),
															"dd-MMM-yyyy"
														)
													: ""}
											</p>
										</div>
									</span>
									<span className=" bg-green-600 px-2 py-1 rounded shadow text-gray-200">
										<p className="text-xs lg:text-sm">
											Promotion{" "}
										</p>
									</span>
								</div>
								<div className="mr-5">
									{/* <button
                                    className="h-10 w-10 rounded-full bg-soft border border-green-600 flex justify-center items-center text-2xl text-green-600"
                                    onClick={() => setShareModal(true)}
                                >
                                    <RxShare2 />
                                </button> */}
								</div>
							</div>

							<div className="listingSection__wrap ">
								<div
									dangerouslySetInnerHTML={{
										__html: blogResponse?.body!,
									}}
									className=" space-y-2 leading-relaxed md:text-lg"
								></div>
							</div>
							{/* {blogResponse?.tags!?.length > 0 ? (
								<div className="space-y-2">
									<h2 className="text-darktext text-2xl font-medium">
										Tags
									</h2>
									<div className="flex space-x-2">
										{blogResponse?.tags?.map(
											(item, index) => (
												<span
													className="bg-[rgb(120,120,120,.2)] px-2 py-1 rounded-md text-lightblue capitalize"
													key={index}
												>
													{item}{" "}
												</span>
											)
										)}
									</div>
								</div>
							) : (
								""
							)} */}
						</div>
					</div>
				) : (
					loadingComponent()
				)}
			</div>
		</div>
	);
};

export default SlugDetailPage;
