import classes from "./VerifyEmail.module.scss";
import { Box } from "../../components/box/Box";
import { Input } from "../../../../components/Input/Input";
import { useState } from "react";
import { Button } from "../../../../components/button/Button";
import { useNavigate } from "react-router-dom";
import { request } from "../../../../utils/api";
import { useAuthentication } from "../../contexts/AuthenticationContextProvider";

export function VerifyEmail(){
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user, setUser} = useAuthentication();
    const navigate = useNavigate();
    
    
    const validateEmail = async (code: string) => {
        setMessage("");
        await request<void>({
            endpoint: `/auth/validate-email-verification-token?token=${code}`,
            method: "PUT",
            onSuccess: () => {
                setErrorMessage("");
                setUser({ ...user!, emailVerified: true});
                navigate("/");
            },
            onFailure: (error) => {
                setErrorMessage(error);
            },
        });
        setIsLoading(false);
    };


    const sendEmailVerificationToken = async () => {
        setErrorMessage("");
        setIsLoading(true);
        await request<void>({
            endpoint: `/auth/send-email-verification-token`,
            onSuccess: () => {
                setErrorMessage("");              
                setMessage("Code sent sucessfully. Please check your email.");
            },
            onFailure: (error) => {
                setErrorMessage(error);
            },
        });
        setIsLoading(false);
    }
    return (
        
        <div className={classes.root}>
            <Box>
                <h1>Verify your email</h1>
                <form onSubmit={async e=>{
                    e.preventDefault();
                    setIsLoading(true);
                    const code = e.currentTarget.code.value;
                    await validateEmail(code);
                }}>
                    <p>Complete your registration. Verify your email adress.</p>

                    <Input type="text" label="Verification code" key="code" name="code"/>
                    {message && <p style={{ color: "green"}}>{message}</p>}
                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                    <Button size ="medium" type="submit" disabled={isLoading}>{isLoading ? "..." : "Validate email"}</Button>
                    <Button size ="medium" outline type="button" disabled={isLoading} onClick={() => {sendEmailVerificationToken();}}>{isLoading ? "..." : "Send again"}</Button>

                </form>
            </Box>
        </div>
    )
}