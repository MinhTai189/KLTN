import { Box, Grid, Theme, Tooltip, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { useHistory } from "react-router-dom"

interface Props {
    labelLeft: string
    contentLeft: string
    titleContentLeft?: string
    linkContentLeft?: string
    labelRight?: string
    contentRight?: string
    titleContentRight?: string
    linkContentRight?: string
    wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word'
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginBlock: theme.spacing(1.2),

        '& .row-content': {
            fontSize: '0.9rem',

            '&.link': {
                cursor: 'pointer',
                transition: '300ms',

                '&:hover': {
                    color: theme.palette.primary.main
                }
            }
        }
    }
}))

const AddRowContent = ({ labelLeft, contentLeft, titleContentLeft, linkContentLeft, labelRight, contentRight, titleContentRight, linkContentRight, wordBreak = 'break-word' }: Props) => {
    const classes = useStyles()
    const history = useHistory()

    const handleNavigate = (isLeft: boolean) => {
        isLeft && linkContentLeft && history.push(linkContentLeft)
        linkContentRight && history.push(linkContentRight)
    }

    return (
        <Box className={classes.root}>
            <Grid container spacing={1}>
                <Grid item sm={labelRight ? 6 : 12}>
                    <Tooltip title={titleContentLeft ?? ''} arrow>
                        <Typography
                            className={`row-content ${linkContentLeft ? 'link' : ''}`}
                            onClick={() => handleNavigate(true)}
                        >
                            {labelLeft}:&#xa0;&#xa0;&#xa0;{contentLeft}
                        </Typography>
                    </Tooltip>
                </Grid>

                {labelRight && <Grid item sm={6}>
                    <Tooltip title={titleContentRight ?? ''} arrow>
                        <Typography
                            className={`row-content ${linkContentRight ? 'link' : ''}`}
                            style={{
                                wordBreak
                            }}
                            onClick={() => handleNavigate(false)}
                        >
                            {labelRight}:&#xa0;&#xa0;&#xa0;{contentRight}
                        </Typography>
                    </Tooltip>
                </Grid>}
            </Grid>
        </Box>
    )
}

export default AddRowContent
