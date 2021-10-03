import { Avatar, Box, Divider, List, ListItem, ListItemIcon, ListItemProps, ListItemText, makeStyles } from '@material-ui/core'
import { ExitToApp } from '@material-ui/icons'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { authActions, selectCurrentUser } from 'features/auth/authSlice'
import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Props {

}

const useStyles = makeStyles(theme => ({
    root: {},
    infoWrap: {
        cursor: 'pointer',
        position: 'relative',
    },
    avatar: {
        boxShadow: theme.shadows[5],
        outline: `3px solid ${theme.palette.primary.main}`,
        overflow: 'hidden',
        transition: `.3s ${theme.transitions.easing.easeIn}`,
        width: 30,
        height: 30,

        "&:hover": {
            transform: 'scale(1.03)',
            boxShadow: theme.shadows[8]
        }
    },
    dropdown: {
        position: 'absolute',
        background: theme.palette.background.default,
        right: 0,
        top: '130%',
        width: 250,
        boxShadow: theme.shadows[7],
        border: `5px solid ${theme.palette.primary.main}`,

        "& a": {
            color: 'inherit'
        }
    }
}))

export const DropDownInfor = (props: Props) => {
    const classes = useStyles()
    const [isShowDD, setIsShowDD] = useState(false)
    const currentUser = useAppSelector(selectCurrentUser)

    const dispatch = useAppDispatch()

    const handleShowDD = () => {
        setIsShowDD(!isShowDD)
    }

    const handleLogout = () => {
        dispatch(authActions.logout())
    }

    function ListItemLink(props: ListItemProps<'a', { button?: true }>) {
        return <ListItem button component="a" {...props} />;
    }

    return (
        <Box className={classes.infoWrap} alignItems="center">
            <Avatar className={classes.avatar} src={currentUser.avatarUrl} onClick={handleShowDD} />

            <List
                className={classes.dropdown}
                style={{ display: isShowDD ? 'inline-block' : 'none' }}>

                {currentUser?.isAdmin && <ListItem button>
                    <ListItemText>
                        <Link to='/admin/dashboard'>
                            Quản lý dữ liệu
                        </Link>
                    </ListItemText>
                </ListItem>}

                <ListItem button>
                    <ListItemText primary='Trang cá nhân' />
                </ListItem>

                <ListItem button>
                    <ListItemText primary='Thông báo' />
                </ListItem>

                <Divider />

                <ListItemLink onClick={handleLogout}>
                    <ListItemIcon>
                        <ExitToApp />
                    </ListItemIcon>
                    <ListItemText primary='Đăng xuất' />
                </ListItemLink>
            </List>
        </Box>
    )
}
