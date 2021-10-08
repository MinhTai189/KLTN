import { Box, Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { ButtonCustom } from "components/Common/Button"
import { classicNameResolver } from "typescript"
import { BoxInfo } from '.'

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        padding: theme.spacing(2.5, 1.5),
        background: '#f7f7f7',
    },
    wrapper: {
        width: '100%',

        "& .title": {
            fontSize: 14,
            paddingBottom: 4,
            position: 'relative',

            "&::after": {
                content: '""',
                position: 'absolute',
                width: 150,
                height: 1,
                background: theme.palette.primary.main,
                bottom: 0,
                left: 0
            }
        }
    },
    btn: {
        textAlign: 'center',
        marginTop: 24
    }
}))

export const InforOnwerUp = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Box className={classes.wrapper} style={{ marginBottom: 16 }}>
                <h5 className='title'>Người đăng tin</h5>

                <BoxInfo isUpdate={false} />
            </Box>

            <Box className={classes.wrapper}>
                <h5 className='title'>Danh sách chỉnh sửa</h5>

                <BoxInfo />
            </Box>

            <Box className={classes.btn}>
                <ButtonCustom>Sửa nhà trọ</ButtonCustom>
            </Box>
        </Box>
    )
}
