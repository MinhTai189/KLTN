import { Box, Theme } from "@material-ui/core"
import { Search } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import { useAppSelector } from "app/hooks"
import { selectListGroupChat } from "features/chats/chatSlice"
import GroupItem from "./GroupItem"

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: '100%',
        padding: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',

        '& .search': {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            background: '#edeef2',
            marginBottom: theme.spacing(1.5),
            padding: theme.spacing(0.5, 1),
            borderRadius: 15,

            '& > .icon': {
                width: 18,
                height: 18,
                marginRight: theme.spacing(0.5)
            },

            '& > input': {
                flex: 1,
                height: 22,
                border: 'none',
                outline: 'none',
                background: 'transparent'
            }
        },

        '& .group-wrapper': {
            flex: 1,
            overflow: 'auto',

            '&::-webkit-scrollbar-track': {
                background: 'transparent'
            },

            '&::-webkit-scrollbar': {
                width: 6,
                background: 'transparent',
            },

            '&::-webkit-scrollbar-thumb': {
                borderRadius: 8,
                background: 'transparent'
            },

            '&:hover': {
                '&::-webkit-scrollbar-thumb': {
                    borderRadius: 8,
                    background: '#66676855'
                }
            },

            '& .list-group': {
                height: '100%',
            }
        }

    }
}))

const GroupSection = (props: Props) => {
    const classes = useStyles()
    const listGroup = useAppSelector(selectListGroupChat)

    return (
        <Box className={classes.root} component='section'>
            <Box className='search'>
                <Search className='icon' />

                <input type="text" placeholder="Tìm kiếm..." />
            </Box>

            <Box className="group-wrapper">
                <ul className="list-group">
                    {listGroup.map(group => (
                        <li key={group._id} className="group">
                            <GroupItem group={group} />
                        </li>
                    ))}
                </ul>
            </Box>
        </Box>
    )
}

export default GroupSection
