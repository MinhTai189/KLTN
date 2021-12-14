import { Box, makeStyles, Theme } from "@material-ui/core"
import { useEffect } from "react"

interface Props {
    open: boolean
    onClose: () => void
    children: any
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'fixed',
        inset: 0,
        opacity: 0,
        zIndex: 10000000000000,
        transform: 'scale(0)',
        transition: '300ms',

        '&.active': {
            transform: 'scale(1)',
            opacity: 1,
        },

        '& .overlay-close': {
            height: 40,
            background: 'rgba(0,0,0,0.45)',
            cursor: 'pointer'
        },

        '& .body': {
            height: 'calc(100vh - 40px)',
            background: '#fff',
            padding: theme.spacing(2.5),
            borderRadius: '20px 20px 0 0',
        }
    }
}))

const ModalUp = ({ children, open, onClose }: Props) => {
    const classes = useStyles()

    useEffect(() => {
        const body: any = document.querySelector("body");

        if (open) {
            body.style.overflow = "hidden"
        } else {
            body.style.overflow = "auto"
        }

        return () => {
            body.style.overflow = "auto"
        }
    }, [open])

    return (
        <Box className={`${classes.root} ${open ? 'active' : ''}`}>
            <div className="overlay-close" onClick={onClose} />

            <Box className="body">
                {children}
            </Box>
        </Box>
    )
}

export default ModalUp
