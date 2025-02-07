import { Box } from "../../components/box/Box";
import classes from "./Login.module.scss";
import { Input } from "../../../../components/Input/Input";
import { FormEvent, useState } from "react";
import { Button } from "../../../../components/button/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Separator } from "../../components/separator/Separator";
import { useAuthentication } from "../../contexts/AuthenticationContextProvider";


export function Login(){
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthentication();
    const navigate = useNavigate();
    const location = useLocation();

    const doLogin = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const email = e.currentTarget.email.value;
        const password = e.currentTarget.password.value;
        
        try {
            await login(email,password);
            const destination = location.state?.from || "/";
            navigate(destination);
        }catch(error){
            if(error instanceof Error){
                setErrorMessage(error.message);
            }else{
                setErrorMessage("Uknown error occured.")
            }
        }finally{
            setIsLoading(false);
        }
    };

    return (
        <div className={classes.root}>
            <Box>
                <h1>Sign in</h1>
                <p>Login into your account</p>
                <form onSubmit={doLogin}>
                    <Input label="Email" type="email" id="email" onFocus={() => setErrorMessage("")}/>
                    <Input label="Password" type="password" id="password" onFocus={() => setErrorMessage("")}/>
                    {errorMessage && <p className={classes.error}>{errorMessage}</p>}

                    <Button size="medium" type="submit" disabled={isLoading}>Sign in</Button>
                    {isLoading ? "..." : "Sign in"}
                    <Link to="/authentication/request-password-reset"> Forgot password?</Link>
                </form>
                <Separator>Or</Separator>
                <div className={classes.register}>
                    New here? <Link to="/authentication/signup">Create account</Link> 
                </div>
            </Box>
        </div>
    )
}