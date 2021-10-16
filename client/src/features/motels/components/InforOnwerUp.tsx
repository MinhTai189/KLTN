import { Box, Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { useAppSelector } from "app/hooks"
import { ButtonCustom } from "components/Common/Button"
import { selectCurrentUser } from "features/auth/authSlice"
import { Editor, Owner } from "models"
import { toast } from "react-toastify"
import { BoxInfo } from '.'

interface OwnerDetail extends Owner {
    createdAt: string
}

interface Props {
    editor: Editor[]
    owner: OwnerDetail
    setOpenModal: (state: boolean) => void
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

export const InforOnwerUp = ({ editor, owner, setOpenModal }: Props) => {
    const classes = useStyles()
    const currentUser = useAppSelector(selectCurrentUser)

    const handleClickUpdate = () => {
        if (!currentUser) {
            toast.error('Bạn phải đăng nhập để có thể sử dụng chức năng này!')
            return;
        }
        setOpenModal(true)
    }

    return (
        <Box className={classes.root}>
            <Box className={classes.wrapper} style={{ marginBottom: 16 }}>
                <h5 className='title'>Người đăng tin</h5>

                <BoxInfo isUpdate={false} owner={owner} />
            </Box>

            <Box className={classes.wrapper}>
                <h5 className='title'>Danh sách chỉnh sửa</h5>

                {editor.length > 0 ? editor.map((item, index) => (
                    <BoxInfo key={index} editor={item} />
                ))
                    : <h5 style={{ width: '100%', textAlign: 'center' }}>Không có lịch sử chỉnh sửa...</h5>
                }
            </Box>

            <Box className={classes.btn}>
                <ButtonCustom onClick={handleClickUpdate}>Sửa nhà trọ</ButtonCustom>
            </Box>
        </Box>
    )
}
