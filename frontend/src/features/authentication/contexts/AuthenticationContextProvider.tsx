import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "../../../components/loader/Loader";
import { request } from "../../../utils/api";

interface AuthenticationResponse {
    token: string;
    message: string;
}

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
        await request<AuthenticationResponse>({
            endpoint: "/auth/login",
            method: "POST",
            body: JSON.stringify({email, password}),
            onSuccess: ({token}) => {
                localStorage.setItem("token", token);
            },
            onFailure: (error) => {
                throw new Error(error);
            }
        })
    };

    const signup = async (email: string, password: string) => {
        await request<AuthenticationResponse>({
            endpoint: "/auth/register",
            method: "POST",
            body: JSON.stringify({email, password}),
            onSuccess: ({token}) => {
                localStorage.setItem("token", token);
            },
            onFailure: (error) => {
                throw new Error(error);
            }
        })
    };

    const logout = async () => {
        localStorage.removeItem("token");
        setUser(null);
    };
    
    
    useEffect(() => {
        if(user){
            return;
        }
        setIsLoading(true);
        const fetchUser = async() => {
            await request<User>({
                endpoint: "/auth/user",
                onSuccess: (data) => setUser(data),
                onFailure: (error) => {
                    console.error(error);
                    
                },
            });
            setIsLoading(false);
        };

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