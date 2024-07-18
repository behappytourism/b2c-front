"use client";
import React, { useEffect, useState } from 'react';

export interface aboutusProps {
    aboutUs: {
        aboutUs: {}
    };
}

function Page() {
    const [aboutUs, setAboutUs] = useState<aboutusProps>({ aboutUs: {aboutUs: {}} });
    const [loading, setLoading] = useState(true);

    const fetchAboutUs = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/home/about-us`,
            );
            return response.json();
        } catch (error) {
            console.log(error);
        }
    };

    async function getAboutus() {
        try {
            const response = await fetchAboutUs();
            if (response) {
                setAboutUs({ aboutUs: response });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAboutus();
    }, []);    

    return (
        <div className="md:px-20">
            {loading ? (
                <div className='w-full'>
                <div className="w-full flex justify-center my-10">
                    <div role="status" className="max-w-xl animate-pulse">
                        <div className="h-2.5 bg-gray-200 rounded-full w-[500px] mb-4"></div>
                        <div className="h-2 bg-gray-200 rounded-full max-w-[660px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full max-w-[430px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full max-w-[700px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full max-w-[560px]"></div>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>

                <div className="w-full flex justify-center my-10">
                    <div role="status" className="max-w-xl animate-pulse">
                        <div className="h-2.5 bg-gray-200 rounded-full w-[500px] mb-4"></div>
                        <div className="h-2 bg-gray-200 rounded-full max-w-[660px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full max-w-[430px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full max-w-[700px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full max-w-[560px]"></div>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>

                <div className="w-full flex justify-center my-10">
                    <div role="status" className="max-w-xl animate-pulse">
                        <div className="h-2.5 bg-gray-200 rounded-full w-[500px] mb-4"></div>
                        <div className="h-2 bg-gray-200 rounded-full max-w-[660px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full max-w-[430px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full max-w-[700px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full max-w-[560px]"></div>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
                </div>
            ) : (
                <>
                    <h1 className="text-3xl flex mt-5 mb-10 w-full justify-center underline">
                        About us
                    </h1>
                    <div className="w-full flex justify-center mb-10 md:px-20 px-4 max-w-screen-2xl mx-auto">
                        <div
                            className="flex flex-col gap-5"
                            dangerouslySetInnerHTML={{ __html: aboutUs?.aboutUs?.aboutUs }}
                        ></div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Page;
