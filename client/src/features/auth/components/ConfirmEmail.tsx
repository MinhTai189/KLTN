import { Box, CircularProgress, makeStyles } from "@material-ui/core"
import { Drafts } from "@material-ui/icons"
import { Alert } from "@material-ui/lab"
import { ButtonCustom } from "components/Common"
import { useParams } from "react-router-dom"
import Header from "./Header"


interface Props {
    loading: boolean
    handleConfirmEmail: (token: string) => void
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 500,
        padding: theme.spacing(3, 4),
        backgroundColor: '#fff',
        outline: `7px solid ${theme.palette.primary.main}`,
        zIndex: 10,
    }
}))

const ConfirmEmail = ({ loading, handleConfirmEmail }: Props) => {
    const classes = useStyles()
    const { token } = useParams<{ token: string }>()

    const handleClickConfirm = () => {
        if (!token) return

        handleConfirmEmail(token)
    }

    return (
        <Box className={classes.root}>
            <Header textBtn='Xác thực email' icon={<Drafts />} />

            <Alert severity="info">
                Nhấn vào nút bên dưới để thực hiện xác thực email!
            </Alert>

            <Box mt={3}>
                <ButtonCustom fullWidth sizeBtn="xlarge" disabled={loading} onClick={handleClickConfirm}>
                    {loading && <><CircularProgress color='secondary' size={20} /> &nbsp;</>}
                    Xác thực
                </ButtonCustom>
            </Box>
        </Box>
    )
}

export default ConfirmEmail
