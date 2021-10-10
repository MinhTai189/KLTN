import { Box, Theme, Tooltip } from "@material-ui/core"
import { CardMembership, CloudUpload, Email } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import School from 'assets/images/school.png'
import { Editor, Owner } from "models"
import { twoNumber } from "utils"

interface OwnerDetail extends Owner {
    createdAt: string
}

interface Props {
    isUpdate?: boolean
    editor?: Editor
    owner?: OwnerDetail
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

export const BoxInfo = ({ isUpdate = true, editor, owner }: Props) => {
    const classes = useStyles()
    const user = editor ? editor.user : owner
    const createdDate = new Date(editor?.createdAt || owner?.createdAt || '')
    const date = `${twoNumber(createdDate.getDay())}/${twoNumber(createdDate.getMonth())}/${createdDate.getFullYear()}`

    return (
        <Box className={classes.root}>
            <img className={classes.avatar} src={user?.avatarUrl} alt="avatar" />

            <Box className={classes.infor}>
                <div className="top">
                    <h3 className='name'>{user?.name}</h3>

                    <small className='position'>Admin</small>
                </div>

                <p>{`${isUpdate ? 'Chỉnh sửa' : 'Đã đăng'}: ${date}`}</p>
            </Box>

            {isUpdate && editor && <Box className={classes.content}>
                {editor.edited}
            </Box>}

            <Box className={classes.controls}>
                <span className="control"><CloudUpload /></span>
                <span className="control"><Email /></span>
                <span className="control"><CardMembership /></span>
            </Box>

            <Tooltip title={user?.school.name || ''}>
                <img className={classes.school} src={user?.avatarUrl} alt="school logo" />
            </Tooltip>
        </Box>
    )
}
