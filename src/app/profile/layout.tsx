import React, { FC } from "react"; import ProfileSideBar from "./ProfileSideBar";
;

export interface CommonLayoutProps {
    children?: React.ReactNode;
}

const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {
    return (
        <div className={`nc-AuthorPage `}>
            <main className="container md:mt-12 mb-24 lg:mb-32">
                <div className="w-full md:space-y-8 lg:space-y-10 lg:pl-10 flex-shrink-0">
                    {children}
                </div>
                <div className="absolute container flex-grow mb-24 lg:mb-0">
                    <div className="lg:fixed bg-white rounded-xl bottom-10 border-white shadow-xl z-10  hidden md:block"><ProfileSideBar /></div>
                </div>
            </main>
        </div>
    );
};

export default CommonLayout;
