import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

interface AdminUsuario {
    id: string;
    usuario: string;
    rol: string;
    modulos: string[];
}

interface AuthAdminContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (tokens: { 
        access_token: string;
        token_type: string;
        usuario: string;
        modulos: string[];
    }) => void;
    logout: () => Promise<void>;
    admin: AdminUsuario | null;
    hasModule: (moduleName: string) => boolean;
}

const AuthAdminContext = createContext<AuthAdminContextType | undefined>(undefined);

export const AuthAdminProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [admin, setAdmin] = useState<AdminUsuario | null>(null);

    const hasModule = (moduleName: string): boolean => {
        return admin?.modulos.includes(moduleName) || false;
    };

    // Configurar axios interceptor para manejar tokens
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    await logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const login = (tokens: { 
        access_token: string;
        token_type: string;
        usuario: string;
        modulos: string[];
    }) => {
        setAccessToken(tokens.access_token);
        setIsAuthenticated(true);
        
        const adminData: AdminUsuario = {
            id: jwtDecode<{ id: string }>(tokens.access_token).id,
            usuario: tokens.usuario,
            rol: 'admin',
            modulos: tokens.modulos
        };
        
        setAdmin(adminData);
        localStorage.setItem('admin_access_token', tokens.access_token);
        localStorage.setItem('admin_usuario', tokens.usuario);
        localStorage.setItem('admin_modulos', JSON.stringify(tokens.modulos));
        localStorage.setItem('admin_data', JSON.stringify(adminData));
        
        // Configurar el token en axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access_token}`;
    };

    const logout = async () => {
        try {
            if (accessToken) {
                await axios.post('http://localhost:8000/logout/', {}, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            setAccessToken(null);
            setIsAuthenticated(false);
            setAdmin(null);
            localStorage.removeItem('admin_access_token');
            localStorage.removeItem('admin_usuario');
            localStorage.removeItem('admin_modulos');
            localStorage.removeItem('admin_data');
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    // Verificar token al cargar
    useEffect(() => {
        const storedAccessToken = localStorage.getItem('admin_access_token');
        const storedAdminData = localStorage.getItem('admin_data');
        
        if (storedAccessToken && storedAdminData) {
            try {
                const decodedToken = jwtDecode(storedAccessToken);
                const currentTime = Date.now() / 1000;
                
                if (decodedToken.exp && decodedToken.exp > currentTime) {
                    setAccessToken(storedAccessToken);
                    setIsAuthenticated(true);
                    setAdmin(JSON.parse(storedAdminData));
                    axios.defaults.headers.common['Authorization'] = `Bearer ${storedAccessToken}`;
                } else {
                    // Token expirado
                    logout();
                }
            } catch (error) {
                console.error('Error al decodificar el token:', error);
                logout();
            }
        }
        setIsLoading(false);
    }, []);

    return (
        <AuthAdminContext.Provider value={{ 
            isAuthenticated, 
            isLoading,
            login, 
            logout, 
            admin,
            hasModule 
        }}>
            {children}
        </AuthAdminContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AuthAdminContext);
    if (context === undefined) {
        throw new Error('useAdminAuth debe ser usado dentro de un AuthAdminProvider');
    }
    return context;
};
