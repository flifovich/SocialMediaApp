import classes from "./VerifyEmail.module.scss";
import { Box } from "../../components/box/Box";
import { Input } from "../../../../components/Input/Input";
import { useState } from "react";
import { Button } from "../../../../components/button/Button";
import { useNavigate } from "react-router-dom";

export function VerifyEmail(){
    console.log("Verify Email component loaded!");
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    
    const validateEmail = async (code: string) => {
        setMessage("");
        try{
            const response = await fetch(
                `${
                    import.meta.env.VITE_API_URL
                }/auth/validate-email-verification-token?token=${code}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if(response.ok){
                setErrorMessage("");
                navigate("/");
            }
            const { message } = await response.json();
            setErrorMessage(message);
        }catch(e){
            console.log(e);
            setErrorMessage("Something went wrong, please try again.");
        }finally {
            setIsLoading(false);
        }
    };
    const sendEmailVerificationToken = async () => {
        setErrorMessage("");
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/send-email-verification-token`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if(response.ok){
                setErrorMessage("");
                setMessage("Code sent! Please check your email.");
                return;
            }
            const { message } = await response.json();
            setErrorMessage(message);
        }catch(e){
            console.log(e);
            setErrorMessage("Something went wrong, please try again");
        }finally {
            setIsLoading(false);
        }
    }
    return (
        
        <div className={classes.root}>
            <Box>
                <h1>Verify your email</h1>
                <form onSubmit={async e=>{
                    
                    setIsLoading(true);
                    const code = e.currentTarget.code.value;
                    await validateEmail(code);
                    setIsLoading(false);
                }}>
                    <p>Complete your registration. Verify your email adress.</p>

                    <Input type="text" label="Verification code" key="code" name="code"/>
                    {message && <p style={{ color: "green"}}>{message}</p>}
                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                    <Button size ="medium" type="submit" disabled={isLoading}>Validate email</Button>
                    <Button size ="medium" outline type="button" disabled={isLoading} onClick={() => {sendEmailVerificationToken();}}>Resend code</Button>

                </form>
            </Box>
        </div>
    )
}