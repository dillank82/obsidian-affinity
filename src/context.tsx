import { App } from "obsidian";
import { createContext, ReactNode, useContext } from "react";

const AppContext = createContext<App | null>(null);

export const AppProvider = ({ children, app }: { children: ReactNode, app: App }) => {
    return (
        <AppContext.Provider value={app} >
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
}