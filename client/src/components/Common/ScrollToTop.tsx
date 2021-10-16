import { useEffect } from "react";
import { useLocation } from "react-router";

export const ScrollToTop = (props: any) => {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto'
        });
    }, [location]);

    return <>{props.children}</>
};
