import { Link, useNavigate } from "react-router-dom";
import { Box } from "../../components/box/Box";
import { Button } from "../../../../components/button/Button";
import { Input } from "../../../../components/Input/Input";
import { Separator } from "../../components/separator/Separator";
import classes from "./Signup.module.scss";
import { FormEvent, useState } from "react";
import { useAuthentication } from "../../contexts/AuthenticationContextProvider";


export function Signup(){
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuthentication();
    const navigate = useNavigate();

    const doSignup = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const email = e.currentTarget.email.value;
        const password = e.currentTarget.password.value;
        try{
            await signup(email,password);
            navigate("/");
        }catch(error) {
            if(error instanceof Error) {
                if (!email){
                    setErrorMessage("Email is Required");
                }
                if (!password) {
                    setErrorMessage("Password is Required");
                }
                if (!email && !password) {
                    setErrorMessage("Email and password are Required");
                }
                if (email && password){
                    setErrorMessage(error.message);
                } 
            } else {
                setErrorMessage("An unknown error occured.");
            }
        }finally {
            setIsLoading(false);
        }
    }
    return (
        <div className={classes.root}>
            <Box>
                <h1>Sign up</h1>
                <p>Create your account now.</p>
                <form onSubmit={doSignup}>
                    <Input type="email" id="email" label="Email"/>
                    <Input type="password" id="password" label="Password"/>
                    {errorMessage && <p className={classes.error}>{errorMessage}</p>}
                    <p className={classes.disclaimer}>
                        By creating account, you agree to SocialApp's{" "}
                        <a href="">User Agreement</a>, <a href="">Privacy Policy</a>, and{" "}
                        <a href="">Cookie Policy</a>
                    </p>
                    <Button size="medium" type="submit" disabled={isLoading}>{isLoading ? "..." : "Create account"}</Button>
                    
                </form>
                <Separator>Or</Separator>
                <div className={classes.register}>
                    Already have an account? <Link to="/authentication/login">Sign in</Link>
                </div>
            </Box>
        </div>
    );
}