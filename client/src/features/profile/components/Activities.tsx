import { Box, Step, StepContent, StepLabel, Stepper, Theme } from "@material-ui/core"
import { Spa } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import { Activity } from "models"
import { useEffect, useState } from "react"
import { ActivitiesInYears } from "../models/Activity"
import StepActivity from "./StepActivity"

interface Props {
    activities: ActivitiesInYears
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        maxWidth: 800,
        margin: '0 auto',

        '& .MuiStepper-root': {
            [theme.breakpoints.down('sm')]: {
                padding: 0
            }
        }
    }
}))

const Activities = ({ activities }: Props) => {
    const classes = useStyles()
    const [steps, setSteps] = useState<any>({})
    const [expended, setExpended] = useState('')

    const years = Object.keys(activities)

    useEffect(() => {
        let result = {}

        years.forEach(year => {
            const month = activities[year].reduce((obj, activities, index) => {
                if (!activities) return obj

                // @ts-ignore
                obj[`${index}-${year}`] = activities

                return obj
            }, {})

            result = { ...month, ...result }
        })

        setSteps(result)
        setExpended(Object.keys(result)[0])
    }, [activities])

    const handleClickExpand = (id: string) => {
        setExpended(prev => {
            if (prev === id)
                return prev
            return id
        })
    }

    return (
        <Box className={classes.root}>
            <Stepper orientation="vertical">
                {Object.keys(steps).map(el => (
                    <Step key={el} expanded={expended === el} active={expended === el} onClick={() => handleClickExpand(el)}>
                        <StepLabel>{`Tháng ${+el.split('-')[0] + 1} - Năm ${el.split('-')[1]}`}</StepLabel>

                        <StepContent>
                            {steps[el].map((activity: Activity) => (
                                <StepActivity key={activity._id} activity={activity} />
                            ))}
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </Box>
    )
}

export default Activities
