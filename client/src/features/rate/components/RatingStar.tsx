import { Box, makeStyles } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { useState } from "react";

interface Props {
    setRateFormValue: (state: number) => void
    rateFormValue: number
}

interface Color {
    bad: string
    fine: string
    good: string
    excellent: string
}

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 18,
        height: 60,
    }
})

const labels: any = {
    0.5: 'Nên tránh xa',
    1: 'Rất tệ',
    1.5: 'Tệ',
    2: 'Không nên thuê',
    2.5: 'Ổn',
    3: 'Tạm Ổn',
    3.5: 'Tốt',
    4: 'Rất tốt',
    4.5: 'Tuyệt vời',
    5: 'Siêu tuyệt vời',
};

const colorBoard: Color = {
    bad: '#f44336',
    fine: '#ff9800',
    good: '#2196f3',
    excellent: '#4caf50'
}

export const RatingStar = ({ setRateFormValue, rateFormValue }: Props) => {
    const classes = useStyles();

    const [hover, setHover] = useState(-1);
    const [color, setColor] = useState('')


    const hanldeColor = (rate: number) => {
        if (rate === -1) rate = rateFormValue
        if (rate <= 1)
            setColor(colorBoard.bad)
        else if (rate > 1 && rate <= 3.5)
            setColor(colorBoard.fine)
        else if (rate > 3.5 && rate < 5)
            setColor(colorBoard.good)
        else setColor(colorBoard.excellent)
    }

    return (
        <div className={classes.root}>
            <Rating
                name="hover-feedback"
                size='large'
                value={rateFormValue}
                precision={0.5}
                onChange={(event, newValue) => {
                    hanldeColor(newValue || 0)
                    setRateFormValue(newValue || 0)
                }}
                onChangeActive={(event, newHover) => {
                    setHover(newHover);
                    hanldeColor(newHover)
                }}
            />
            {rateFormValue !== null &&
                <Box mt={0.5}
                    style={{ fontSize: 16, fontWeight: 700, color }}>
                    {labels[hover !== -1 ? hover : rateFormValue]}
                </Box>}
        </div>
    );
}
