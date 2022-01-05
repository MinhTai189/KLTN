import { Avatar, Box, Chip, IconButton, TextField, Theme, Tooltip, Typography } from '@material-ui/core'
import { Menu, MenuOpen, PersonAdd, Settings } from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'
import { makeStyles } from '@material-ui/styles'
import { Modal } from 'antd'
import ListboxComponent from 'components/Home/Hero/ListboxComponent'
import { ComponentType, HTMLAttributes, useContext, useState } from 'react'
import { ChatContext } from '..'

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing(1, 2),
        background: '#edeef2',
        border: '1px solid #ccc',

        '& .info': {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(1),

            '& .avatar': {
                height: 55,
                width: 55,
            },

            '& .name': {
                fontSize: '1.3rem',
                lineHeight: 1,
                fontWeight: 500,
                marginBottom: 0
            },

            '& .member': {
                paddingLeft: theme.spacing(0.5),
                color: theme.palette.text.secondary,
                fontSize: '0.9rem'
            }
        },

        '& .controls': {
            display: 'flex'
        }
    },
    listFriend: {
        display: 'flex',
        alignItems: 'center',

        '& > .avatar': {
            marginRight: theme.spacing(1)
        }
    }
}))

const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
    { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Seven Samurai', year: 1954 },
    { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 },
    { title: 'The Silence of the Lambs', year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: 'Life Is Beautiful', year: 1997 },
    { title: 'The Usual Suspects', year: 1995 },
    { title: 'Léon: The Professional', year: 1994 },
    { title: 'Spirited Away', year: 2001 },
    { title: 'Saving Private Ryan', year: 1998 },
    { title: 'Once Upon a Time in the West', year: 1968 },
    { title: 'American History X', year: 1998 },
    { title: 'Interstellar', year: 2014 },
    { title: 'Casablanca', year: 1942 },
    { title: 'City Lights', year: 1931 },
    { title: 'Psycho', year: 1960 },
    { title: 'The Green Mile', year: 1999 },
    { title: 'The Intouchables', year: 2011 },
    { title: 'Modern Times', year: 1936 },
    { title: 'Raiders of the Lost Ark', year: 1981 },
    { title: 'Rear Window', year: 1954 },
    { title: 'The Pianist', year: 2002 },
    { title: 'The Departed', year: 2006 },
    { title: 'Terminator 2: Judgment Day', year: 1991 },
    { title: 'Back to the Future', year: 1985 },
    { title: 'Whiplash', year: 2014 },
    { title: 'Gladiator', year: 2000 },
    { title: 'Memento', year: 2000 },
    { title: 'The Prestige', year: 2006 },
    { title: 'The Lion King', year: 1994 },
    { title: 'Apocalypse Now', year: 1979 },
    { title: 'Alien', year: 1979 },
    { title: 'Sunset Boulevard', year: 1950 },
    { title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
    { title: 'The Great Dictator', year: 1940 },
    { title: 'Cinema Paradiso', year: 1988 },
    { title: 'The Lives of Others', year: 2006 },
    { title: 'Grave of the Fireflies', year: 1988 },
    { title: 'Paths of Glory', year: 1957 },
    { title: 'Django Unchained', year: 2012 },
    { title: 'The Shining', year: 1980 },
    { title: 'WALL·E', year: 2008 },
    { title: 'American Beauty', year: 1999 },
    { title: 'The Dark Knight Rises', year: 2012 },
    { title: 'Princess Mononoke', year: 1997 },
    { title: 'Aliens', year: 1986 },
    { title: 'Oldboy', year: 2003 },
    { title: 'Once Upon a Time in America', year: 1984 },
    { title: 'Witness for the Prosecution', year: 1957 },
    { title: 'Das Boot', year: 1981 },
    { title: 'Citizen Kane', year: 1941 },
    { title: 'North by Northwest', year: 1959 },
    { title: 'Vertigo', year: 1958 },
    { title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
    { title: 'Reservoir Dogs', year: 1992 },
    { title: 'Braveheart', year: 1995 },
    { title: 'M', year: 1931 },
    { title: 'Requiem for a Dream', year: 2000 },
    { title: 'Amélie', year: 2001 },
    { title: 'A Clockwork Orange', year: 1971 },
    { title: 'Like Stars on Earth', year: 2007 },
    { title: 'Taxi Driver', year: 1976 },
    { title: 'Lawrence of Arabia', year: 1962 },
    { title: 'Double Indemnity', year: 1944 },
    { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
    { title: 'Amadeus', year: 1984 },
    { title: 'To Kill a Mockingbird', year: 1962 },
    { title: 'Toy Story 3', year: 2010 },
    { title: 'Logan', year: 2017 },
    { title: 'Full Metal Jacket', year: 1987 },
    { title: 'Dangal', year: 2016 },
    { title: 'The Sting', year: 1973 },
    { title: '2001: A Space Odyssey', year: 1968 },
    { title: "Singin' in the Rain", year: 1952 },
    { title: 'Toy Story', year: 1995 },
    { title: 'Bicycle Thieves', year: 1948 },
    { title: 'The Kid', year: 1921 },
    { title: 'Inglourious Basterds', year: 2009 },
    { title: 'Snatch', year: 2000 },
    { title: '3 Idiots', year: 2009 },
    { title: 'Monty Python and the Holy Grail', year: 1975 },
];

const ChatInfomation = (props: Props) => {
    const classes = useStyles()
    const value = useContext(ChatContext)
    const [showAddMemberModal, setShowAddMemberModal] = useState(false)

    return (
        <>
            <Box className={classes.root}>
                <Box className='info' component='span'>
                    <Avatar className='avatar'>Y</Avatar>

                    <span className="detail">
                        <Typography className='name' variant='h5'>
                            Trao đổi, hỏi đáp, giao lưu
                        </Typography>

                        <Typography className='member'>
                            8 thành viên
                        </Typography>
                    </span>
                </Box>

                <ul className='controls'>
                    <li className="control" onClick={() => setShowAddMemberModal(true)}>
                        <Tooltip title='Thêm thành viên'>
                            <IconButton color="primary">
                                <PersonAdd fontSize='small' />
                            </IconButton>
                        </Tooltip>
                    </li>
                    <li className="control">
                        <Tooltip title='Tùy chỉnh'>
                            <IconButton color="primary">
                                <Settings fontSize='small' />
                            </IconButton>
                        </Tooltip>
                    </li>
                    <li className="control" onClick={() => value.setShowShowListOnline(!value.showListOnline)}>
                        <Tooltip title={value.showListOnline ? 'Thu gọn' : 'Danh sách thành viên'}>
                            <IconButton color="primary">
                                {value.showListOnline ? <Menu fontSize='small' />
                                    : <MenuOpen fontSize='small' />
                                }
                            </IconButton>
                        </Tooltip>
                    </li>
                </ul>
            </Box>

            <Modal
                visible={showAddMemberModal}
                title='Thêm thành viên'
                okText='Hoàn thành'
                cancelText='Hủy'
                onCancel={() => setShowAddMemberModal(false)}
            >
                <Box className='add-member-wrapper'>
                    <Autocomplete
                        options={top100Films}
                        multiple
                        getOptionLabel={(option) => option.title}
                        renderInput={(params) => <TextField {...params} label="Danh sách tài khoản" variant="outlined" />}
                        ListboxComponent={ListboxComponent as ComponentType<HTMLAttributes<HTMLElement>>}
                        renderOption={() => (
                            <Box className={classes.listFriend}>
                                <Avatar className='avatar'>U</Avatar>

                                <Typography className='name'>
                                    Trần Minh Tài
                                </Typography>
                            </Box>
                        )}
                        renderTags={(value: any, getTagProps) =>
                            value.map((option: any, index: number) => (
                                <Chip
                                    // color='secondary'
                                    size='small'
                                    avatar={<Avatar>U</Avatar>}
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                    />
                </Box>
            </Modal>
        </>
    )
}

export default ChatInfomation
