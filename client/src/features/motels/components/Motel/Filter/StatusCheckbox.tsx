import { Box, Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { ChangeEvent } from "react";

interface Props {
    filter: any
    handleChangeStatus: (e: ChangeEvent<HTMLInputElement>) => void
}

const useStyles = makeStyles({
    root: {
        '& .MuiFormGroup-root': {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',

            '& .MuiTypography-root': {
                fontSize: '0.85em'
            },
        }
    }
})

export const StatusCheckbox = ({ filter, handleChangeStatus }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={filter.status[0]}
                            onChange={handleChangeStatus}
                            name="available"
                            size='small'
                        />
                    }
                    label="Còn phòng"
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={filter.status[1]}
                            onChange={handleChangeStatus}
                            name="unavailable"
                            size='small'
                        />
                    }
                    label="Hết phòng"
                />
            </FormGroup>
        </Box>
    )
}
