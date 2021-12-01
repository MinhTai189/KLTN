import { Divider, List, ListItem, ListItemIcon, ListItemProps, ListItemText, makeStyles } from '@material-ui/core'
import { ExitToApp } from '@material-ui/icons'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { authActions, selectCurrentUser } from 'features/auth/authSlice'
import { showCreateModalAction } from 'features/posts/showCreateModalSlice'
import { Link } from 'react-router-dom'

interface Props {
}

const useStyles = makeStyles(theme => ({
    root: {
        background: theme.palette.background.default,
        width: 250,
        boxShadow: theme.shadows[5],
        borderRadius: 10,

        "& a": {
            color: 'inherit'
        }
    }
}))

export const DropDownInfor = ({ }: Props) => {
    const classes = useStyles()
    const currentUser = useAppSelector(selectCurrentUser)
    const dispatch = useAppDispatch()

    const handleLogout = () => {
        dispatch(authActions.logout())
    }

    const handleClickCreatePost = () => {
        dispatch(showCreateModalAction.open())
    }

    function ListItemLink(props: ListItemProps<'a', { button?: true }>) {
        return <ListItem button component="a" {...props} />;
    }

    return (
        <List className={classes.root}>
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

            <ListItem
                button
                onClick={handleClickCreatePost}
            >
                <ListItemText primary='Đăng bài viết' />
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
    )
}
