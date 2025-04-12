import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useCallback,
} from "react";
import { NavigateFunction } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Tipos
type AdminUserDecoded = {
    id: string;
    usuario: string;
    rol: string;
    modulos: string[];
    exp: number;
};

type AdminUser = {
    access_token: string;
    token_type: string;
    usuario: string;
    rol: string;
    modulos: string[];
};

type AdminAuthContextType = {
    admin: AdminUser | null;
    login: (data: { access_token: string; token_type: string; usuario: string; modulos: string[] }) => void;
    logout: (navigate?: NavigateFunction) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    hasModule: (moduleName: string) => boolean; // <- NUEVO
};

// Contexto
const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Proveedor
export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const hasModule = (moduleName: string) => {
        return admin?.modulos.includes(moduleName) || false;
    };

    const validateToken = useCallback((token: string): boolean => {
        try {
            const { exp } = jwtDecode<{ exp: number }>(token);
            return Date.now() < exp * 1000;
        } catch (error) {
            console.log("Error al validar token:", error);
            return false;
        }
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem("adminUser");
        if (stored) {
            const parsed: AdminUser = JSON.parse(stored);
            if (validateToken(parsed.access_token)) {
                setAdmin(parsed);
            } else {
                logout();
            }
        }
        setIsLoading(false);
    }, [validateToken]);

    const login = (data: { access_token: string; token_type: string; usuario: string; modulos: string[] }) => {
        try {
            if (typeof data.access_token !== "string") {
                throw new Error("Token inválido: no es un string");
            }

            const decoded = jwtDecode<AdminUserDecoded>(data.access_token);
            const adminUser: AdminUser = {
                ...data,
                rol: decoded.rol,
            };
            setAdmin(adminUser);
            localStorage.setItem("adminUser", JSON.stringify(adminUser));
        } catch (error) {
            console.error("Error al decodificar token de admin:", error);
        }
    };


    const logout = (navigate?: NavigateFunction) => {
        setAdmin(null);
        localStorage.removeItem("adminUser");
        if (navigate) {
            navigate("/admin/login", { replace: true });
        }
    };

    const isAuthenticated = !!admin;

    return (
        <AdminAuthContext.Provider value={{ admin, login, logout, isAuthenticated, isLoading, hasModule }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

// Hook
export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error("useAdminAuth debe usarse dentro de un AdminAuthProvider");
    }
    return context;
}
