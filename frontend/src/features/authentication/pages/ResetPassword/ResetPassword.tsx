
import classes from "./ResetPassword.module.scss";
import { Box } from "../../components/box/Box";
import { Input } from "../../../../components/Input/Input";
import { Button } from "../../../../components/button/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { request } from "../../../../utils/api";

export function ResetPassword(){
    const navigate = useNavigate();
    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const sendPasswordResetToken = async (email: string) => {
        await request<void>({
            endpoint: `/auth/send-password-reset-token?email=${email}`,
            method: "PUT",
            onSuccess: () => {
                setErrorMessage("");
                setEmailSent(true);
            },
            onFailure: (error) => {
                setErrorMessage(error);
                console.error(error);
            },
        });
        setIsLoading(false);
    }

    const resetPassword = async (email: string, code: string, password: string) => {
        await request<void>({
            endpoint: `/auth/reset-password?email=${email}&token=${code}&newPassword=${password}`,
            method: "PUT",
            onSuccess: () => {
                setErrorMessage("");
                navigate("/login");
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
                <h1>Reset password</h1>
                {
                    !emailSent ? 
                    (
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        setIsLoading(true);
                        const email = e.currentTarget.email.value;
                        await sendPasswordResetToken(email);
                        setEmail(email);
                        setIsLoading(false);
                    }}>
                        <p>Enter your email. You will recieve a verification code for password reset.</p>
                        <Input name="email" type="email" label="Email"/>
                        <p style={{color:"red"}}>{errorMessage}</p>
                        <Button size ="medium" type="submit" disabled={isLoading}>Next</Button>
                        <Button size ="medium" type="button" outline onClick={() => {navigate("/authentication/login")}}>Back</Button>
                    </form>
                    ) : (
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        setIsLoading(true);
                        const code = e.currentTarget.code.value;
                        const password = e.currentTarget.password.value;
                        await resetPassword(email, code, password);
                        setEmail(email);
                        setIsLoading(false);
                    }}>
                        <p>Enter the verification code we sent to your email and your new password.</p>
                        <Input type="text" label="Verification code" key="code" name="code"/>
                        <Input type="password" label="New password" key="password" name="password" id="password"/>
                        <p style={{color:"red"}}>{errorMessage}</p>
                        <Button size ="medium" type="submit">Reset password</Button>
                        <Button size ="medium" type="button" outline onClick={() => {
                            setErrorMessage("");
                            setEmailSent(false)}}>Back</Button>
                    </form>
                    )
                
                }
            </Box>
        </div>
    )
}