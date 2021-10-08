import { Box, Theme } from "@material-ui/core"
import { CardMembership, CloudUpload, Email } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import Avatar from 'assets/images/avatar-default.jpg'
import School from 'assets/images/school.png'

interface Props {
    isUpdate?: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        background: 'white',
        padding: '16px 0 8px',
        display: 'grid',
        gridGap: 4,
        gridTemplateAreas: `'avatar infor infor'
                            'school content content'
                            'school controls controls'`,
        marginTop: 16,

        "& p": {
            margin: 0,
            lineHeight: 1.3,
        }
    },
    avatar: {
        gridArea: 'avatar',
        width: '80%',
        borderRadius: '50%',
        placeSelf: 'center',
        boxShadow: '0 0 4px 2px #ccc'
    },
    infor: {
        gridArea: 'infor',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',

        "& .top": {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',

            "& .name": {
                fontSize: 17,
                margin: 0,
                lineHeight: 1,
            },
        },
    },
    content: {
        gridArea: 'content',

        "& p": {
            marginBottom: 8,
        }
    },
    school: {
        gridArea: 'school',
        borderRadius: '50%',
        width: 25,
        placeSelf: 'start center',
        paddingTop: 4
    },
    controls: {
        gridArea: 'controls',

        "& span": {
            marginRight: 24
        },

        "& .MuiSvgIcon-root": {
            fill: theme.palette.secondary.main
        }
    },
}))

export const BoxInfo = ({ isUpdate = true }: Props) => {
    const classes = useStyles()
    return (
        <Box className={classes.root}>
            <img className={classes.avatar} src={Avatar} alt="avatar" />

            <Box className={classes.infor}>
                <div className="top">
                    <h3 className='name'>Trần Minh Tài</h3>

                    <small className='position'>Admin</small>
                </div>

                <p>Đã đăng: 17/07/2021</p>
            </Box>

            {isUpdate && <Box className={classes.content}>
                <p>Chỉnh sửa nhà trọ: lân cận, trạng thái, ảnh bìa,...</p>
                <p>Chỉnh sửa nhà trọ: lân cận, trạng thái, ảnh bìa,...</p>
            </Box>}

            <Box className={classes.controls}>
                <span className="control"><CloudUpload /></span>
                <span className="control"><Email /></span>
                <span className="control"><CardMembership /></span>
            </Box>
            <img className={classes.school} src={School} alt="" />
        </Box>
    )
}
