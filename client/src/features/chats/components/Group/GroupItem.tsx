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
            },

            '& .not-seen-dot': {
                position: 'absolute',
                top: -4,
                right: -4,
                width: 11,
                height: 11,
                background: '#ff4d4f',
                borderRadius: '50%',

                '&::after': {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    animation: '$ripple 1.2s infinite ease-in-out',
                    border: '2px solid #ff4d4f',
                    content: '""',
                },
            }
        },

        '& .info': {
            display: 'block',
            width: 'calc(100% - 58px)',

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
                    color: theme.palette.text.secondary,
                    fontSize: '0.7rem',

                    '&.not-seen': {
                        color: '#ff4d4f'
                    }
                },

                '& .date': {
                    fontSize: '0.7rem',
                    color: theme.palette.text.secondary,
                    flexShrink: 0
                }
            }
        }
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(1.8)',
            opacity: 0,
        },
    },
}))

// amount of avatar
export const optionAvatar = new Map([
    [1, { class: 'one', slice: 1 }],
    [2, { class: 'two', slice: 2 }],
    [4, { class: 'four', slice: 4 }],
])

export const changeMeToLastMember = (members: Owner[], meId: string) => {
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
        image: `???? g???i ${lastMessage.urlImages.length} ???nh`,
        gif: '???? g???i ???nh gif',
        link: lastMessage.content,
    }

    const ownerName = meId === lastMessage.owner._id ? 'B???n' : lastMessage.owner.name

    return {
        ownerName,
        // @ts-ignore
        content: listText[lastMessage.type]
    }
}

const checkSeenMessage = (listSeen: string[], meId: string) => {
    return listSeen.includes(meId)
}

const GroupItem = ({ actived, group }: Props) => {
    const classes = useStyles()
    const currentUser: User | undefined = useAppSelector(selectCurrentUser)

    const [members, setMembers] = useState(group.members)
    const [lastMessage, setLastMessage] = useState({
        ownerName: 'B???n',
        content: ''
    })
    const [amountAvatar, setAmountAvatar] = useState(optionAvatar.get(1))

    const [isSee, setIsSee] = useState(false)

    const { name, createdAt, lastMessage: { seen } } = group

    useEffect(() => {
        if (currentUser) {
            setMembers(changeMeToLastMember(group.members, currentUser._id))

            setLastMessage(handleLastMessage(group.lastMessage, currentUser._id))

            setIsSee(checkSeenMessage(seen, currentUser._id))

            if (group.members.length > 2 && group.members.length < 4)
                setAmountAvatar(optionAvatar.get(2))

            if (group.members.length >= 4)
                setAmountAvatar(optionAvatar.get(4))
        }
    }, [currentUser, group, seen])

    return (
        <Box className={`${classes.root} ${actived ? 'active' : ''}`}>
            <Box className={`avatar ${amountAvatar?.class}`}>
                {members.slice(0, amountAvatar?.slice || 1).map(member => (
                    <Avatar key={member._id} src={member.avatarUrl}>
                        U
                    </Avatar>
                ))}

                {!isSee && <span className="not-seen-dot" />}
            </Box>

            <Box className='info' component='span'>
                <Typography className="name" variant="h4">
                    {name}
                </Typography>

                <Box className='row'>
                    <Typography className={`text ${isSee ? '' : 'not-seen'}`}>
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
