import { SignupInput } from "@jxty07/medium-common";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config";


//trpc
export const Auth = ({type}: {type: "signup" | "signin"})=> {
    const navigate = useNavigate();
    const [postInput, setPostInput] = useState<SignupInput>({
        name: "",
        email: "",
        password: ""
    })

    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInput)
            const jwt = response.data.jwt
            localStorage.setItem("token", jwt)
            navigate("/blogs")
        } catch(e) {
            console.error("Error during request:", e);
        }
    }

    return (
        <div className=" h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div>
                    <div className="px-10">
                        <div className="text-3xl font-extrabold">
                            Create an account
                        </div>
                        <div className="text-slate-500">
                            {type === "signin" ? "Dont have an account?" :" Already have an account?"} 
                            <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                            {type === "signin" ? "Sign up" : "Sign in"}
                            </Link>
                        </div>
                    </div>
                    <div className="pt-8">
                    {type === 'signup' ? < LabeledInput label='Name' placeholder="Enter your name" onChange={(e)=> {
                        setPostInput({
                            ...postInput,
                            name: e.target.value
                        })
                    }} />: null}
                    < LabeledInput label='Email' placeholder="m@example.com" onChange={(e)=> {
                        setPostInput({
                            ...postInput,
                            email: e.target.value
                        })
                    }} />
                    < LabeledInput label='Password' type={'password'} placeholder="" onChange={(e)=> {
                        setPostInput({
                            ...postInput,
                            password: e.target.value
                        })
                    }} />
                    </div>
                    <button onClick={sendRequest} type="button" className="mt-8 w-full text-white bg-gray-800 hover:
                    bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium 
                    rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 
                    dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign up" : "Sign in"}</button>
                </div>
            </div>
        </div>
    )
}

interface LabelledInputType {
    label:string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>)=> void;
    type?: string
}
function LabeledInput({label, placeholder, onChange, type}: LabelledInputType) {
    return (
        <>
        <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
        <input onChange={onChange} type={type || "text"} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
        </>
    )
}