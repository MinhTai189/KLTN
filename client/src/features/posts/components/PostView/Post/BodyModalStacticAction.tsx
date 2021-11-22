import { makeStyles, Theme, Badge, Avatar, Typography, Box } from "@material-ui/core"
import { useAction } from "hooks"
import { LikePost } from "models"
import { Link } from "react-router-dom"
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer"

interface Props {
    listLike: LikePost[]
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: 350,
        width: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',

        '& *::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
            background: '#F5F5F5'
        },

        '& *::-webkit-scrollbar': {
            width: 2,
            backgroundColor: '#F5F5F5',
        },

        '& *::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
        },
    },
    rows: {
        padding: theme.spacing(1.5, 0),

        '& .wrapper': {
            display: 'flex',
            alignItems: 'center',

            '& .avatar': {
                marginRight: theme.spacing(2),

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
}))

export const BodyModalStacticAction = ({ listLike }: Props) => {
    const classes = useStyles()
    const listAction = useAction()

    const Row = (({ index, style }: { index: number; style: any }) => (
        <Box
            key={listLike[index]._id}
            className={classes.rows}
            style={style}
        >
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
                    badgeContent={listAction[listLike[index].type].icon}
                >
                    <Avatar src={listLike[index].owner.avatarUrl} />
                </Badge>

                <Typography className='name'>
                    {listLike[index].owner.name}
                </Typography>
            </Link>
        </Box>
    ))

    return (
        <Box className={classes.root}>
            <AutoSizer>
                {({ width, height }: { width: any, height: any }) => (
                    <List
                        itemCount={listLike.length}
                        itemSize={50}
                        height={height}
                        width={width}
                    >
                        {Row}
                    </List>
                )}
            </AutoSizer>
        </Box>
    )
}
