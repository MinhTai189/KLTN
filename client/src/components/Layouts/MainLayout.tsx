import { Box } from "@material-ui/core"
import { Footer, Header } from "components/Common"

interface Props {
    children: any
    isChangeNav?: boolean
}

export const MainLayout = ({ children, isChangeNav = true }: Props) => {
    return (
        <>
            <Header isChangeNav={isChangeNav} />

            <Box>
                {children}
            </Box>

            <Footer />
        </>
    )
}
