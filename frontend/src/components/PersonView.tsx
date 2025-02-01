import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    id: z.string().min(1),
})

type FormFields = z.infer<typeof schema>;

// TASK 4
export default function PersonView() {
    const form = useForm<FormFields>({ resolver: zodResolver(schema) });
    const { register, handleSubmit, formState } = form;
    const { errors } = formState;
    const [isShowingResults, setIsShowingResults] = useState(false);
    const [fetchingError, setFetchingError] = useState("");
    const [resultData, setResultData] = useState({
        id: "",
        firstName: "",
        lastName: "",
        DOB: "",
        phoneNumber: "",
        email: ""
    });

    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        try {
            setFetchingError("")
            setIsShowingResults(false)
            const url = `http://localhost:8080/people/get/${data.id}`

            const response = await fetch(url, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                const json = await response.json()
                setResultData(json)
                setIsShowingResults(true)
            } else {
               setFetchingError("Person not found")
            }
        } catch (error) {
            setFetchingError("Person not found")
        }
    }

    const buttonStyles = clsx("bg-blue-500 text-white px-4 py-2 rounded mt-4");
    const tableCellLabel = clsx("text-black text-right");
    const tableCell = clsx("text-black pl-4");
    const inputClassName = clsx("text-black bg-white border border-gray-300 rounded px-4 py-2 mt-1");

    return (
        <div className="p-10 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <label className={"text-black text-2xl"}>ID of Person</label>
            <input className={inputClassName} type="text" {...register("id")} />
            <p className={"text-red-400"}>{errors.id?.message}</p>
            <button type="submit" className={buttonStyles}>View</button>
            <p className={"text-red-400"}>{fetchingError}</p>
        </form>

        <div className="mt-4">
           {isShowingResults &&
                    <table className="w-full min-w-max table-auto text-left">
                        <tbody >
                            <tr>
                                <td className={tableCellLabel}>ID</td>
                                <td className={tableCell}>{resultData.id}</td>
                            </tr>
                            <tr>
                                <td className={tableCellLabel}>First Name</td>
                                <td className={tableCell}>{resultData.firstName}</td>
                            </tr>
                            <tr>
                                <td className={tableCellLabel}>Last Name</td>
                                <td className={tableCell}>{resultData.lastName}</td>
                            </tr>
                            <tr>
                                <td className={tableCellLabel}>Date Of Birth</td>
                                <td className={tableCell}>{resultData.DOB}</td>
                            </tr>
                            <tr>
                                <td className={tableCellLabel}>Phone Number</td>
                                <td className={tableCell}>{resultData.phoneNumber}</td>
                            </tr>
                            <tr>
                                <td className={tableCellLabel}>Email</td>
                                <td className={tableCell}>{resultData.email}</td>
                            </tr>
                        </tbody>

                    </table>
            }
        </div>

        </div>
    );

}