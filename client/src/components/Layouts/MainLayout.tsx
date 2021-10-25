import { Box } from "@material-ui/core"
import { Header } from "components/Common"

interface Props {
    children: any
    isChangeNav?: boolean
    hero?: any
}

export const MainLayout = ({ children, isChangeNav = true, hero }: Props) => {
    return (
        <>
            <Header isChangeNav={isChangeNav} />

            {hero}

            <Box className='container'>
                {children}
            </Box>
        </>
    )
}
