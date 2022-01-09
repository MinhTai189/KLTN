import { Avatar, Box, makeStyles, Theme, Typography } from "@material-ui/core"
import { useAppSelector } from "app/hooks"
import { selectCurrentUser } from "features/auth/authSlice"
import { ChatGroup, ChatMessage, Owner, User } from "models"
import { useEffect, useState } from "react"
import { calculateCreatedTime } from "utils/convert-date/calculateCreatedTime"

interface Props {
    actived?: boolean
    group: ChatGroup
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        cursor: 'pointer',
        padding: theme.spacing(1, 0.5),
        borderRadius: 8,
        transition: '300ms',

        '&.active': {
            background: '#c4d9e9 !important',
        },

        '&:hover': {
            background: '#edeef2'
        },

        '& .avatar': {
            width: 50,
            height: 50,
            marginRight: theme.spacing(1),
            flexShrink: 0,
            position: 'relative',

            '&.one .MuiAvatar-root': {
                width: '100%',
                height: '100%',
            },

            '&.two .MuiAvatar-root': {
                width: '65%',
                height: '65%',
                position: 'absolute',

                '&:nth-child(1)': {
                    right: 0,
                    top: 0
                },

                '&:nth-child(2)': {
                    left: 0,
                    bottom: 0
                },
            },

            '&.four': {
                display: 'flex',
                flexWrap: 'wrap',

                '& .MuiAvatar-root': {
                    width: '50%',
                    height: '50%',
                }
            }
        },

        '& .info': {
            '& .name': {
                fontSize: '1rem',
                fontWeight: 500
            },

            '& .row': {
                display: 'flex',
                alignItems: 'center',

                '& .text': {
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    flex: 1,
                    color: theme.palette.text.secondary,
                    fontSize: '0.85rem'
                },

                '& .date': {
                    fontSize: '0.7rem',
                    color: theme.palette.text.secondary
                }
            }
        }
    }
}))

// amount of avatar
const optionAvatar = new Map([
    [1, { class: 'one', slice: 1 }],
    [2, { class: 'two', slice: 2 }],
    [4, { class: 'four', slice: 4 }],
])

const changeMeToLastMember = (members: Owner[], meId: string) => {
    const result = [...members]

    const index = result.findIndex(member => member._id === meId)

    if (index === -1) return members

    const temp = result[result.length - 1]
    result[result.length - 1] = result[index]
    result[index] = temp

    return result
}

const handleLastMessage = (lastMessage: ChatMessage, meId: string) => {
    const listText = {
        text: lastMessage.content,
        image: `đã gửi ${lastMessage.urlImages.length} ảnh`,
        gif: 'đã gửi ảnh gif',
        link: lastMessage.content,
    }

    const ownerName = meId === lastMessage.owner._id ? 'Bạn' : lastMessage.owner.name

    return {
        ownerName,
        // @ts-ignore
        content: listText[lastMessage.type]
    }
}

const GroupItem = ({ actived, group }: Props) => {
    const classes = useStyles()
    const currentUser: User = useAppSelector(selectCurrentUser)
    const [members, setMembers] = useState(group.members)
    const [lastMessage, setLastMessage] = useState({
        ownerName: 'Bạn',
        content: ''
    })

    const { name, createdAt, lastMessage: message } = group

    let amountAvatar = optionAvatar.get(1)

    if (group.members.length > 2 && group.members.length < 4)
        amountAvatar = optionAvatar.get(2)

    if (group.members.length >= 4)
        amountAvatar = optionAvatar.get(4)

    useEffect(() => {
        if (currentUser) {
            setMembers(changeMeToLastMember(group.members, currentUser._id))

            setLastMessage(handleLastMessage(message, currentUser._id))
        }
    }, [currentUser])

    return (
        <Box className={`${classes.root} ${actived ? 'active' : ''}`}>
            <Box className={`avatar ${amountAvatar?.class}`}>
                {members.slice(0, amountAvatar?.slice || 1).map(member => (
                    <Avatar src={member.avatarUrl}>
                        U
                    </Avatar>
                ))}
            </Box>

            <Box className='info' component='span'>
                <Typography className="name" variant="h4">
                    {name}
                </Typography>

                <Box className='row'>
                    <Typography className="text">
                        {`${lastMessage.ownerName} ${lastMessage.content}`}
                    </Typography>

                    <Typography className='date'>
                        &#xa0;&#x22C5;&#xa0;{calculateCreatedTime(createdAt)}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default GroupItem
