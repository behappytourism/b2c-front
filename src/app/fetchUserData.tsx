'use client'

import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/features/usersSlice";
import { useEffect } from "react";

const FetchUserData = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { jwtToken } = useSelector((state: RootState) => state.users);

    useEffect(() => {
        async function getUserData() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/my-account`, {
                    next: { revalidate: 10 }, 
                    headers: {
                        authorization: `Bearer ${jwtToken}`,
                    },
                });

                if (response.status !== 200) {
                    localStorage.removeItem("random-string");
                } else {
                    dispatch(setUser({ user: await response.json(), jwtToken: jwtToken }));
                }

            } catch (err: any) {
                console.log(err, "user-data");
                localStorage.removeItem("random-string");
            }
        }

        getUserData();
    }, [dispatch, jwtToken]);

    return <></>;
}

export default FetchUserData;
