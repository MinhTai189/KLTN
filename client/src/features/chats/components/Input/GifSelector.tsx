import { Box, Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { LIST_GIF } from "constant/constant"

interface Props {
    onChange: (gif: string) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100vw',
        maxWidth: 450,
        height: 500,
        background: '#fff',
        boxShadow: theme.shadows[5],
        position: 'absolute',
        bottom: '150%',
        left: 0,
        padding: theme.spacing(1),
        borderRadius: 5,

        '& .wrapper': {
            overflowY: 'scroll',
            overflowX: 'hidden',
            width: '100%',
            height: '100%',

            '& .list-gif': {
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: theme.spacing(1),

                '& .gif': {
                    width: '100%',
                    aspectRatio: '1 / 1',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',

                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.8)',
                        display: 'none',
                        zIndex: 3
                    },

                    '&:hover::after': {
                        display: 'block'
                    },

                    '& img': {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }
                }
            }
        }
    }
}))

const GifSelector = ({ onChange }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Box className="wrapper">
                <ul className="list-gif">
                    {LIST_GIF.map((gif, index) => (
                        <li
                            key={index}
                            className="gif"
                            onClick={() => onChange(gif)}
                        >
                            <img src={gif} alt='' />
                        </li>
                    ))}
                </ul>
            </Box>
        </Box>
    )
}

export default GifSelector
