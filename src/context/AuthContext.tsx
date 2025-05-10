import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import { NavigateFunction } from "react-router-dom";
import axios from 'axios';

// Tipos de TypeScript
type Usuario = {
    id: string;
    name: string;
    email: string;
    role: 'user';
};

type AuthContextType = {
    token: string | null;
    login: (token: string) => void;
    logout: (navigate?: NavigateFunction) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    user: Usuario | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<Usuario | null>(null);

    const validateToken = useCallback((token: string): boolean => {
        try {
            const { exp } = jwtDecode<{ exp: number }>(token);
            return Date.now() < exp * 1000;
        } catch (error) {
            console.log("Error al decodificar el token:", error);
            return false;
        }
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("usuario");
        
        if (storedToken && storedUser) {
            if (validateToken(storedToken)) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                // Configurar el token en axios
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            } else {
                logout();
            }
        }

        setIsLoading(false);
    }, [validateToken]);

    const login = (token: string) => {
        try {
            const decodedToken = jwtDecode<Usuario>(token);
            setToken(token);
            setUser(decodedToken);
            
            localStorage.setItem("usuario", JSON.stringify(decodedToken));
            localStorage.setItem("token", token);
            
            // Configurar el token en axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
            console.error("Error al decodificar el token:", error);
        }
    };

    const logout = (navigate?: NavigateFunction) => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common['Authorization'];

        if (navigate) {
            navigate("/login", { replace: true });
        }
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider
            value={{ token, login, logout, isAuthenticated, isLoading, user }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
}
