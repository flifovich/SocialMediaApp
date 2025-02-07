import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "../../../components/loader/Loader";

export interface User {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    profilePicture?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    description?: string;
    profileComplete: boolean;
}

interface AuthenticationContextType {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => void;
}
const AuthenticationContext = createContext<AuthenticationContextType | null>(null);

export function useAuthentication(){
    return useContext(AuthenticationContext)!;
}



export function AuthenticationContextProvider(){
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    const isOnAuthPage =
    location.pathname === "/authentication/login" ||
    location.pathname === "/authentication/signup" ||
    location.pathname === "/authentication/request-password-reset";

    const login = async (email: string, password: string) => {
        const response = await fetch(import.meta.env.VITE_API_URL + "/auth/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
        });
        if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem("token", token);
        } else {
            const { message } = await response.json();
            throw new Error(message);
        }
    };

    const signup = async (email: string, password: string) => {
        const response = await fetch(import.meta.env.VITE_API_URL + "/auth/register",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
        });
        if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem("token", token);
        } else {
            const { message } = await response.json();
            throw new Error(message);
        }
    };

    const logout = async () => {
        localStorage.removeItem("token");
        setUser(null);
    };
    
    const fetchUser = async() => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + "/auth/user", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if(!response.ok) {
                throw new Error("Authentication failed");
            }
            const user = await response.json();
            setUser(user);
        }catch(e){
            console.error(e);
        }finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(user){
            return;
        }
        fetchUser();
    }, [user, location.pathname]);

    if(isLoading){
        return <Loader />
    }

    if(!isLoading && !user && !isOnAuthPage){
        return <Navigate to="/authentication/login"/>;
    }

    if (user && !user.emailVerified && location.pathname !== "/authentication/verify-email"){
        return <Navigate to="/authentication/verify-email" />
    }
    

    if (user && user.emailVerified && location.pathname == "/authentication/verify-email") {
        return <Navigate to="/" />;
    }

    

    if(
        user &&
        user.emailVerified &&
        !user.profileComplete &&
        !location.pathname.includes("/authentication/profile")
    ) {
        return <Navigate to={`/authentication/profile/${user.id}`} />
    }

    if(
        user &&
        user.emailVerified &&
        user.profileComplete &&
        location.pathname.includes("/authentication/profile")
    ){
        return <Navigate to="/" />
    }

    if(user && isOnAuthPage){
        return <Navigate to="/" />
    }

    return <AuthenticationContext.Provider value={{ user, setUser, login, signup, logout }}>
        <Outlet />
    </AuthenticationContext.Provider>
}