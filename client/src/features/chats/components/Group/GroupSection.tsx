import { Box, Theme } from "@material-ui/core"
import { Search } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { chatActions, selectFilterMessageChat, selectListGroupChat } from "features/chats/chatSlice"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
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
    const dispatch = useAppDispatch()

    const filterMessage = useAppSelector(selectFilterMessageChat)
    const listGroup = useAppSelector(selectListGroupChat)
    const location = useLocation<{ groupId: string }>()

    const [activedGroup, setActivedGroup] = useState('')

    useEffect(() => {
        if (location.state) {
            setActivedGroup(location.state.groupId)
        } else {
            listGroup.length > 0 && setActivedGroup(listGroup[0]._id)
        }
    }, [location, listGroup])

    useEffect(() => {
        if (activedGroup !== '') {
            dispatch(chatActions.getChatMessage({
                ...filterMessage,
                _groupId: activedGroup
            }))
        }
    }, [activedGroup])

    return (
        <Box className={classes.root} component='section'>
            <Box className='search'>
                <Search className='icon' />

                <input type="text" placeholder="Tìm kiếm..." />
            </Box>

            <Box className="group-wrapper">
                <ul className="list-group">
                    {listGroup.map((group, index) => {
                        const actived = activedGroup === group._id

                        return (<li key={group._id} className="group">
                            <GroupItem
                                group={group}
                                actived={actived}
                            />
                        </li>
                        )
                    })}
                </ul>
            </Box>
        </Box>
    )
}

export default GroupSection
