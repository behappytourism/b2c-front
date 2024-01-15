"use client";
import { setDocumentSubmitted } from "@/redux/features/visaSlice";
import ButtonPrimary from "@/shared/ButtonPrimary";
import BtnLoader from "@/shared/Loader/BtnLoader";
import ErrorModal from "@/shared/Status/ErrorModal";
import React, { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface UsersState {
  jwtToken: string;
}

interface VisaState {
  documentSubmitted: boolean;
}

interface RootState {
  users: UsersState;
  visa: VisaState;
}

interface VisaSubmissionFormPage {
  setDocSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  docSubmitted: boolean;
  visaOrderId: string;
  data: {
    _id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: {
      day: number;
      month: number;
      year: number;
    };
    expiryDate: {
      day: number;
      month: number;
      year: number;
    };
    passportNo: string;
    isStatus: string;
  };
}

const VisaDocumentSubmitForm: FC<VisaSubmissionFormPage> = ({
  data,
  visaOrderId,
  setDocSubmitted,
  docSubmitted,
}) => {
  const [passportFistPagePhoto, setPassportFistPagePhoto] = useState<File[]>(
    []
  );
  const [passportLastPagePhoto, setPassportLastPagePhoto] = useState<File[]>(
    []
  );
  const [passportSizePhoto, setPassportSizePhoto] = useState<File[]>([]);
  const [supportiveDoc1, setSupportiveDoc1] = useState<File[]>([]);
  const [supportiveDoc2, setSupportiveDoc2] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<boolean>(false); // changed to a single boolean
  const { jwtToken } = useSelector((state: RootState) => state.users);
  const { documentSubmitted } = useSelector((state: RootState) => state.visa);
  const dispatch = useDispatch();

  const onChangePassportFistPagePhotoHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const temp_images: File[] = [...passportFistPagePhoto];
    temp_images[0] = e.target.files?.[0] as File;
    setPassportFistPagePhoto(temp_images);
  };

  const onChangePassportLastPagePhotoHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const temp2_images: File[] = [...passportLastPagePhoto];
    temp2_images[0] = e.target.files?.[0] as File;
    setPassportLastPagePhoto(temp2_images);
  };

  const onChangePassportSizePhotoHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const temp3_images: File[] = [...passportSizePhoto];
    temp3_images[0] = e.target.files?.[0] as File;
    setPassportSizePhoto(temp3_images);
  };

  const onChangeSupportiveDoc1Handler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const temp4_images: File[] = [...supportiveDoc1];
    temp4_images[0] = e.target.files?.[0] as File;
    setSupportiveDoc1(temp4_images);
  };

  const onChangeSupportiveDoc2Handler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const temp5_images: File[] = [...supportiveDoc2];
    temp5_images[0] = e.target.files?.[0] as File;
    setSupportiveDoc2(temp5_images);
  };

  const visaDocumentSubmission = async (travellerId: string) => {
    setError("");
    setLoading(true);

    const createUrl = `visa/application/document/${visaOrderId}/${travellerId}`;

    const formData = new FormData();
    for (let i = 0; i < passportFistPagePhoto.length; i++) {
      formData.append("passportFistPagePhoto", passportFistPagePhoto[i]);
    }
    for (let i = 0; i < passportLastPagePhoto.length; i++) {
      formData.append("passportLastPagePhoto", passportLastPagePhoto[i]);
    }
    for (let i = 0; i < passportSizePhoto.length; i++) {
      formData.append("passportSizePhoto", passportSizePhoto[i]);
    }
    for (let i = 0; i < supportiveDoc1.length; i++) {
      formData.append("supportiveDoc1", supportiveDoc1[i]);
    }
    for (let i = 0; i < supportiveDoc2.length; i++) {
      formData.append("supportiveDoc2", supportiveDoc2[i]);
    }

    // let headers = {}
    // if (jwtToken?.length && jwtToken !== null && jwtToken !== undefined) {
    //   headers = {
    //     "Content-Type": "multipart/form-data",
    //     Authorization: `Bearer ${jwtToken}`,
    //   }
    // } else {
    //   headers = {
    //     "Content-Type": "multipart/form-data",
    //   }
    // }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/${createUrl}`,
        {
          method: "POST",
          body: formData,
          //  headers: headers
        }
      );

      return response.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function visaDocumentInitiating(travellerId: string) {
    try {
      const response = await visaDocumentSubmission(travellerId);
      {
        response && dispatch(setDocumentSubmitted(!documentSubmitted));
      }

      setDocSubmitted(!docSubmitted);
      {
        response?.error && setError(response?.error);
      }
      setLoading(false);

      {
        !response?.error && setSubmissionStatus(true);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const closeModal = () => {
    setError("");
  };

  return (
    <div className="listingSection__wrap">
      {data?.isStatus === "initiated" && (
        <>
          {/* HEADING */}
          <h2 className="text-2xl font-semibold">
            {data?.isStatus === "initiated" ? "Upload Details" : "Uploaded"}
          </h2>
          <div className="listingSection__wrap">
            <div className="md:flex md:justify-between">
              <div className="flex gap-4">
                <p className="text-neutral-400">First Name</p>
                <p className="font-semibold">{data?.firstName}</p>
              </div>
              <div className="flex gap-4">
                <p className="text-neutral-400">Last Name</p>
                <p className="font-semibold">{data?.lastName}</p>
              </div>
              <div className="flex gap-4">
                <p className="text-neutral-400">Date of Birth</p>
                <p className="font-semibold">
                  {data?.dateOfBirth?.day}
                  <span className="text-neutral-400">/</span>
                  {data?.dateOfBirth?.month}
                  <span className="text-neutral-400">/</span>
                  {data?.dateOfBirth?.year}
                </p>
              </div>
            </div>
            <div className="md:flex md:justify-between">
              <div className="flex gap-4">
                <p className="text-neutral-400">Passport Number</p>
                <p className="font-semibold">{data?.passportNo}</p>
              </div>
              <div className="flex gap-4">
                <p className="text-neutral-400">Passport Expiry Date</p>
                <p className="font-semibold">
                  {data?.expiryDate?.day}
                  <span className="text-neutral-400">/</span>
                  {data?.expiryDate?.month}
                  <span className="text-neutral-400">/</span>
                  {data?.expiryDate?.year}
                </p>
              </div>
            </div>

            <div className="listingSection__wrap">
              <div className="grid md:grid-cols-2  gap-9">
                {/* File input for Passport First Page */}
                <div className="flex flex-col min-w-[200px]">
                  <label htmlFor="" className="label">
                    Passport First Page{" "}
                    <span className="text-red-800 text-[11px]">required*</span>
                  </label>
                  <input
                    className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none"
                    name="passportFistPagePhoto"
                    type={"file"}
                    required
                    onChange={(e) => onChangePassportFistPagePhotoHandler(e)}
                  />
                </div>

                {/* File input for Passport Second Page */}
                <div className="min-w-[200px]">
                  <label htmlFor="" className="label">
                    Passport Second Page{" "}
                    <span className="text-red-800 text-[11px]">required*</span>
                  </label>
                  <input
                    className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none "
                    name="passportLastPagePhoto"
                    type={"file"}
                    required
                    onChange={(e) => onChangePassportLastPagePhotoHandler(e)}
                  />
                </div>

                {/* File input for Passport Size Photo */}
                <div className="min-w-[200px]">
                  <label htmlFor="" className="label">
                    Passport Size Photo{" "}
                    {/* <span className="text-red-800 text-[11px]">required*</span> */}
                  </label>
                  <input
                    className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none "
                    name="passportSizePhoto"
                    type={"file"}
                    required
                    onChange={(e) => onChangePassportSizePhotoHandler(e)}
                  />
                </div>

                {/* File input for Supportive Document 1 */}
                <div className="min-w-[200px]">
                  <label htmlFor="" className="label">
                    Supportive Document 1{" "}
                    {/* <span className="text-red-800 text-[11px]">required*</span> */}
                  </label>
                  <input
                    className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none "
                    name="supportiveDoc1"
                    type={"file"}
                    required
                    onChange={(e) => onChangeSupportiveDoc1Handler(e)}
                  />
                </div>

                {/* File input for Supportive Document 2 */}
                <div className="min-w-[200px]">
                  <label htmlFor="" className="label">
                    Supportive Document 2
                  </label>
                  <input
                    className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none "
                    name="supportiveDoc2"
                    type={"file"}
                    onChange={(e) => onChangeSupportiveDoc2Handler(e)}
                  />
                </div>
              </div>
            </div>
            <div className="w-full">
              {passportFistPagePhoto.length > 0 &&
                passportLastPagePhoto.length > 0 && (
                  <div className="md:pt-8">
                    <ButtonPrimary
                      disabled={submissionStatus}
                      onClick={() => visaDocumentInitiating(data?._id)}
                      className="w-full"
                    >
                      {loading ? (
                        <BtnLoader />
                      ) : submissionStatus ? (
                        "Submitted"
                      ) : (
                        "Submit Document"
                      )}
                    </ButtonPrimary>
                  </div>
                )}
            </div>
          </div>
        </>
      )}

      <ErrorModal
        title="Something went wrong"
        text={error}
        isOpen={error?.length > 0}
        closeModal={closeModal}
      />
      {data?.isStatus === "submitted" && (
        <>
          {/* HEADING */}
          <h2 className="text-2xl font-semibold">
            {data?.isStatus === "submitted"
              ? "Details Uploaded!"
              : "Upload Details"}
          </h2>
          <div className="listingSection__wrap">
            <div className="md:flex md:justify-between">
              <div className="flex gap-4">
                <p className="text-neutral-400">First Name</p>
                <p className="font-semibold">{data?.firstName}</p>
              </div>
              <div className="flex gap-4">
                <p className="text-neutral-400">Last Name</p>
                <p>{data?.lastName}</p>
              </div>
              <div className="flex gap-4">
                <p className="text-neutral-400">Date of Birth</p>
                <p>
                  {data?.dateOfBirth?.day}
                  <span className="text-neutral-400">/</span>
                  {data?.dateOfBirth?.month}
                  <span className="text-neutral-400">/</span>
                  {data?.dateOfBirth?.year}
                </p>
              </div>
            </div>
            <div className="md:flex md:justify-between">
              <div className="flex gap-4">
                <p className="text-neutral-400">Passport Number</p>
                <p>{data?.passportNo}</p>
              </div>
              <div className="flex gap-4">
                <p className="text-neutral-400">Passport Expiry Date</p>
                <p>
                  {data?.expiryDate?.day}
                  <span className="text-neutral-400">/</span>
                  {data?.expiryDate?.month}
                  <span className="text-neutral-400">/</span>
                  {data?.expiryDate?.year}
                </p>
              </div>
            </div>

            <div className="listingSection__wrap">
              <div className="flex items-center text-center gap-7">
                <i className="las la-check-circle text-3xl"></i>
                <p className="font-semibold md:text-3xl">Document Submitted</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VisaDocumentSubmitForm;
