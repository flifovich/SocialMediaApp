import { useState } from "react";
import { Input } from "../../../../components/Input/Input";
import { Box } from "../../components/box/Box";
import classes from "./Profile.module.scss";
import { Button } from "../../../../components/button/Button";
import { useAuthentication } from "../../contexts/AuthenticationContextProvider";
import { useNavigate } from "react-router-dom";

export function Profile() {
    const [step, setStep] = useState(0);
    const [error, setError] = useState("");
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        description: "",
        profilePicture: "",
    });
    const { user, setUser } = useAuthentication();
    const navigate = useNavigate();

    const handleProfileInfo = async () => {
        if (!data.firstName || !data.lastName) {
            setError("Please fill in your first and last name");
            return;
        }

        if (!data.username) {
            setError("Please set your preffered username");
        }

        if (!data.description) {
            setError("Please fill in short description");
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/profile/${user?.id}?firstName=${data.firstName}&lastName=${data.lastName}
                &username=${data.username}&description=${data.description}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                }
            );
            if (response.ok){
                const updatedUser = await response.json();
                setUser(updatedUser);
            }else {
                const { message } = await response.json();
                throw new Error(message);
            }
        }catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }else {
                setError("An unknown error occurred.")
            }
        }finally {
            navigate("/");
        }
    };

    return (
        <div className={classes.root}>
            <Box>
                <h1>Only one last step</h1>
                <p>Please fill in neccessary information for better user experience!</p>
                {step === 0 && (
                    <div className={classes.inputs}>
                        <Input
                            onFocus={() => setError("")}
                            required
                            label="First Name"
                            name="firstName"
                            placeholder="Enter your first name"
                            onChange={(e) => setData((prev) => ({ ...prev, firstName: e.target.value }))}
                        ></Input>
                        <Input
                            onFocus={() => setError("")}
                            required
                            label="Last Name"
                            name="lastName"
                            placeholder="Enter your last name"
                            onChange={(e) => setData((prev) => ({ ...prev, lastName: e.target.value }))}
                        ></Input>
                    </div>
                )}
                {step === 1 && (
                    <div className={classes.input}>
                        <Input
                            onFocus={() => setError("")}
                            required
                            label="Username"
                            name="username"
                            placeholder="Enter your username"
                            onChange={(e) => setData((prev) => ({ ...prev, username: e.target.value }))}
                        ></Input>
                    </div>
                )}
                {step === 2 && (
                    <div className={classes.input}>
                        <Input
                            onFocus={() => setError("")}
                            required
                            label="Description"
                            name="description"
                            placeholder="Short description about you"
                            onChange={(e) => setData((prev) => ({ ...prev, description: e.target.value }))}
                        ></Input>
                    </div>
                )}
                
                {error && <div className={classes.error}>{error}</div>}

                <div className={classes.buttons}>
                    {step > 0 && (
                        <Button size="medium" outline onClick={() => setStep((prev) => prev-1)}>
                            Back
                        </Button>
                    )}
                    {step < 2 && (
                        <Button
                            size="medium"
                            disabled={
                                (step === 0 && (!data.firstName || !data.lastName)) ||
                                (step === 1 && (!data.username))
                            }
                            onClick={() => setStep((prev) => prev + 1)}
                        >
                            Next
                        </Button>
                    )}
                    {step === 2 && (
                        <Button
                            size="medium"
                            disabled={!data.description}
                            onClick={handleProfileInfo}
                            >
                            Submit
                        </Button>
                    )}
                </div>
            </Box>
            
            
        </div>
    )
}