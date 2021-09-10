import { Avatar, Box, makeStyles, List, ListItem, ListItemText, Divider, ListItemIcon, ListItemProps } from '@material-ui/core'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { ExitToApp } from '@material-ui/icons'
import { authActions, selectCurrentUser } from 'features/auth/authSlice'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from 'utils'

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
        transition: '.3s',

        "&:hover": {
            border: '1px solid'
        }
    },
    dropdown: {
        position: 'absolute',
        background: theme.palette.background.default,
        right: 0,
        top: '110%',
        width: 200,
        boxShadow: theme.shadows[7],

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
        const { refreshToken } = getToken()

        dispatch(authActions.logout(refreshToken as string))
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
