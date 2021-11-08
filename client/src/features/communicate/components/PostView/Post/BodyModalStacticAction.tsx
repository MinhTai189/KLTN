import { makeStyles, Theme, Badge, Avatar, Typography } from "@material-ui/core"
import { Phone } from "@material-ui/icons"
import { useAction } from "hooks"
import { Link } from "react-router-dom"

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: 350,
        overflowX: 'hidden',
        overflowY: 'auto',

        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
            background: '#F5F5F5'
        },

        '&::-webkit-scrollbar': {
            width: 2,
            backgroundColor: '#F5F5F5',
        },

        '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
        },

        '& .rows': {
            padding: theme.spacing(1.5, 0),

            '& .wrapper': {
                display: 'flex',
                alignItems: 'center',

                '& .avatar': {
                    marginRight: 12,

                    '& .MuiAvatar-root': {
                        width: 35,
                        height: 35,
                    },

                    '& .MuiBadge-badge': {
                        '& svg': {
                            width: 20,
                            height: 20,
                        }
                    }
                },

                '& .name': {
                    fontSize: '1.1em',
                    color: theme.palette.primary.dark
                }
            },
        }
    }
}))

export const BodyModalStacticAction = (props: Props) => {
    const classes = useStyles()
    const listAction = useAction()

    return (
        <ul className={classes.root}>
            {new Array(1).fill(1).map((row, index) => {
                return <li className="rows">
                    <Link
                        to='/'
                        className='wrapper'
                    >
                        <Badge
                            className='avatar'
                            overlap="circular"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            badgeContent={listAction[0].icon}
                        >
                            <Avatar>U</Avatar>
                        </Badge>

                        <Typography className='name'>
                            Tran Minh Tai
                        </Typography>
                    </Link>
                </li>
            })}
        </ul>
    )
}
