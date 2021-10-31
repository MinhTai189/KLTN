import { makeStyles, Paper, Theme } from "@material-ui/core"
import { useEffect } from "react"

interface Props {
    open: boolean
    onCancel: () => void
    children: any
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'fixed',
        zIndex: 189,
        width: '100%',
        height: '100%',
        display: 'none',
        placeItems: 'center',
        left: 0,
        top: 0
    },
    cover: {
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.2);',
        zIndex: -1
    },
    modal: {
        padding: theme.spacing(2),
        minWidth: '30%',
        minHeight: '40%',
    }
}))

export const Modal = ({ open, children, onCancel }: Props) => {
    const classes = useStyles()

    useEffect(() => {
        const body: any = document.querySelector("body");

        if (open) {
            document.body.style.position = 'fixed';
            document.body.style.overflowY = 'scroll';
            document.body.style.top = `-${window.scrollY}px`;
        } else {
            document.body.style.position = '';
            document.body.style.top = '';
        }
    }, [open])

    return (
        <div
            className={classes.root}
            style={{ display: open ? 'grid' : 'none' }}
        >
            <div
                className={classes.cover}
                onClick={onCancel}
            ></div>

            <Paper className={classes.modal}>
                {children}
            </Paper>
        </div>
    )
}