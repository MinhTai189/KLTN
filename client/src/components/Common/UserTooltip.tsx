import { Avatar, Box, Divider, Theme, Tooltip, Typography, withStyles, Zoom } from "@material-ui/core";
import { CardGiftcard, CloudUpload, Loyalty, VerifiedUser } from "@material-ui/icons";
import { Owner, User } from "models";
import { Link } from "react-router-dom";

interface Props {
    data: User | Owner
    children: any
}

const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
        background: '#fff',
        maxWidth: 280,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[4],
        padding: theme.spacing(1, 2),

        '& .MuiTooltip-arrow::before': {
            background: '#fff'
        },

        '& .tooltip-wrapper': {
            '& .top': {
                display: 'flex',
                alignItems: 'center',

                '& .avatar': {
                    width: 55,
                    height: 55,
                    marginRight: theme.spacing(1.5)
                },

                '& .info': {
                    '& .name': {
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        lineHeight: 1,
                        marginBottom: theme.spacing(0.2),

                        '& > .icon': {
                            width: 13,
                            height: 13,
                        }
                    },

                    '& .school': {
                        fontSize: '0.7rem',
                        color: theme.palette.text.secondary,
                        marginBottom: theme.spacing(0.3)
                    },

                    '& .rank': {
                        fontSize: '0.55rem',
                        background: '#edeef2',
                        borderRadius: 5,
                        padding: theme.spacing(0.2, 0.8)
                    }
                }
            },

            '& .list-info': {
                display: 'flex',
                gap: theme.spacing(1),
                flexWrap: 'wrap',
                justifyContent: 'space-around',

                '& .item': {
                    display: 'flex',
                    alignItems: 'center',

                    '& .icon': {
                        width: '0.975rem',
                        height: '0.975rem',
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        background: theme.palette.text.secondary,
                        marginRight: theme.spacing(0.5),

                        '& svg': {
                            height: '70%',
                            width: '70%',
                            fill: '#fff'
                        }
                    },

                    '& .text': {
                        fontSize: '0.8rem',
                        color: theme.palette.text.secondary
                    }
                }
            }
        }
    },
}))(Tooltip);

const BodyTooltip = (user: User | Owner) => {
    return (
        <Link className="tooltip-wrapper" to={`/profile/${user._id}`}>
            <Box className="top">
                <Avatar
                    className='avatar'
                    src={user.avatarUrl}
                >
                    {user.name[0]}
                </Avatar>

                <Box className="info">
                    <Typography
                        className='name'
                        variant='h5'
                    >
                        {user.name}&#xa0;

                        {user.isAdmin && <VerifiedUser className='icon' color='primary' />}
                    </Typography>

                    <Typography className="school">
                        {typeof user.school === 'string' ? user.school : user.school?.name}
                    </Typography>

                    <Typography className="rank" component='span'>
                        {user.isAdmin ? 'Admin' : user.rank}
                    </Typography>
                </Box>
            </Box>

            <Divider style={{
                marginBlock: 8
            }} />

            <ul className="list-info">
                <li className='item'>
                    <span className="icon">
                        <CardGiftcard />
                    </span>

                    <Typography className='text'>
                        {user.credit} điểm uy tín
                    </Typography>
                </li>
                <li className='item'>
                    <span className="icon">
                        <CloudUpload />
                    </span>

                    <Typography className='text'>
                        {user?.posts ?? 0} bài đăng
                    </Typography>
                </li>
                <li className='item'>
                    <span className="icon">
                        <Loyalty />
                    </span>

                    <Typography className='text'>
                        {user?.totalLikes ?? 0} yêu thích
                    </Typography>
                </li>
            </ul>
        </Link>
    )
}

export const UserTooltip = ({ data, children }: Props) => {
    return (
        <HtmlTooltip
            arrow
            interactive
            TransitionComponent={Zoom}
            title={
                BodyTooltip(data)
            }
        >
            {children}
        </HtmlTooltip>
    )
}
