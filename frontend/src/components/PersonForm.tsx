import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

// TASK 2 is up to you on where you put the validaton

// TASK 1
const personSchema = z.object({
    id: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    DOB: z.string().min(1),
    phoneNumber: z.string().min(1),
    email: z.string().email(),
})

// TASK 1
const postPath = "/people/save";
const putPath = "/people/get";

type FormFields = z.infer<typeof personSchema>;

export default function PersonForm() {
    // Form handling
    const form = useForm<FormFields>({ resolver: zodResolver(personSchema) });
    const { register, handleSubmit, formState } = form;
    const { errors } = formState;
    const [isUpdating, setIsUpdating] = useState(false);

    // Success message handling
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [unsuccessfulMessage, setUnsuccessfulMessage] = useState<string | null>(null);
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        if (unsuccessfulMessage) {
            const timer = setTimeout(() => {
                setUnsuccessfulMessage(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [unsuccessfulMessage]);
    // Form submission handling

    
    const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
        setUnsuccessfulMessage("");
        // VALIDATION FOR TASK 2 (done on backend too for consistency - can never trust the user on the front end ;))
        let isValidName = (data.firstName.charAt(0) === data.firstName.charAt(0).toUpperCase())
        isValidName = (data.lastName.charAt(0) === data.lastName.charAt(0).toUpperCase() && isValidName)
        if(isValidName) {
        try {
            const url = isUpdating ? `http://localhost:8080${putPath}/${data.id}` : `http://localhost:8080${postPath}`;
            const method = isUpdating ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                const json = await response.json()
                console.log(response)
                // TASK 3
                const dynamicSuccessMessage = isUpdating ? `Updated Person's details for id: ${json.id} - ` : `Created Person with the id: ${json.id} - `;
                setSuccessMessage(dynamicSuccessMessage + JSON.stringify(json, null, 2));
            } else {
                setUnsuccessfulMessage("Failed to create person");
            }
        } catch (error) {
            console.log(error)
        }
    } else {
        setUnsuccessfulMessage("Names must start with a capital letter")
    }

    }

    // Re-used classNames
    const labelClassName = clsx("text-black mt-5");
    const inputClassName = clsx("text-black bg-white border border-gray-300 rounded px-4 py-2 mt-1");
    const errorClassName = clsx("text-red-400");
    const buttonStyles = clsx("bg-blue-500 text-white px-4 py-2 rounded mt-4");

    return (
        <div className="p-10 bg-white rounded-lg shadow-md">
        <div className="lg:min-w-96">
            <div>
                <h1 className={"text-black text-2xl"}>Person</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                <label className={labelClassName} htmlFor="id">ID</label>
                <input className={inputClassName} type="text" id="id" {...register("id")} />

                {/* TASK 1 Add more attribute fields here */}

                <label className={labelClassName} htmlFor="firstName">First Name</label>
                <input className={inputClassName} type="text" id="firstName" {...register("firstName")} />
                <label className={labelClassName} htmlFor="lastName">Last Name</label>
                <input className={inputClassName} type="text" id="lastName" {...register("lastName")} />
                <label className={labelClassName} htmlFor="DOB">Date Of Birth</label>
                <input className={inputClassName} type="date" id="DOB" {...register("DOB")} />
                <label className={labelClassName} htmlFor="phoneNumber">Phone Number</label>
                <input className={inputClassName} type="tel" id="phoneNumber" {...register("phoneNumber")} />
                <label className={labelClassName} htmlFor="email">Email</label>
                <input className={inputClassName} type="email" id="email" {...register("email")} />
                <p className={errorClassName}>{errors.id?.message}</p>

                <div className="flex justify-between mt-4">
                    <button className={buttonStyles}
                        type="submit"
                        onClick={() => setIsUpdating(false)}
                    >
                        Create
                    </button>
                    <button className={buttonStyles}
                        type="submit"
                        onClick={() => setIsUpdating(true)}
                    >
                        Update
                    </button>
                </div>
            </form>

            {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
            {unsuccessfulMessage && <p className="text-red-400 mt-4">{unsuccessfulMessage}</p>}
        </div>
        </div>
    );
}