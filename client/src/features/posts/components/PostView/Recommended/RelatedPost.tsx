import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'
import { RecommendedLayout } from '../Layout/RecommendedLayout'

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        listStyle: 'disc',
        marginLeft: theme.spacing(3),

        '& .item': {
            marginBottom: 4,

            '& a': {
                display: 'block',
                fontSize: '1.05em',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                transition: '300ms',

                '&:hover': {
                    color: theme.palette.primary.main
                }
            }
        }
    }
}))

export const RelatedPost = (props: Props) => {
    const classes = useStyles()

    return (
        <RecommendedLayout title='Bài viết liên quan'>
            <ul className={classes.root}>
                {new Array(6).fill(1).map((item, index) => (
                    <li
                        key={index}
                        className="item"
                    >
                        <Link to='/'>
                            Lorem ipsum dolor Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui nihil eos eligendi sit. Animi expedita ab nihil? N
                        </Link>
                    </li>
                ))}
            </ul>
        </RecommendedLayout>
    )
}
