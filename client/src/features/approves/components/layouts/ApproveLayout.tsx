import { Accordion, AccordionSummary, Paper, Theme, Typography } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from "@material-ui/styles";

interface Props {
    children: any
    label: string
    isExpand: boolean
    quantity: number
    onClose: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .MuiAccordionSummary-root': {
            '& .label': {
                fontSize: '1rem',
                textTransform: 'uppercase',
                fontWeight: 500,
            },

            '& .amount': {
                display: 'grid',
                placeItems: 'center',
                width: 18,
                height: 18,
                marginLeft: theme.spacing(1),
                background: theme.palette.primary.main,
                fontSize: '0.65em',
                color: '#fff',
                borderRadius: '50%'
            }
        },

        '& .wrapper': {
            padding: theme.spacing(1),
        }
    }
}))

const ApproveLayout = ({ children, label, isExpand, quantity, onClose }: Props) => {
    const classes = useStyles()

    return (
        <Accordion
            className={classes.root}
            expanded={isExpand}
            onChange={onClose}
        >

            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography
                    className='label'
                    variant='h3'
                >
                    {label}
                </Typography>

                <Typography className="amount" component='span'>
                    {quantity}
                </Typography>
            </AccordionSummary>

            <Paper className='wrapper'>
                {children}
            </Paper>
        </Accordion>
    )
}

export default ApproveLayout
