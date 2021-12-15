import { Box, Step, StepContent, StepLabel, Stepper, Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { Activity } from "models"
import { useEffect, useState } from "react"
import { ActivitiesInYears } from "./models/Activity"
import StepActivity from "./StepActivity"

interface Props {
    activities: ActivitiesInYears
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
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

    const years = Object.keys(activities)

    useEffect(() => {
        years.forEach(year => {
            const month = activities[year].reduce((obj, activities, index) => {
                if (!activities) return obj

                // @ts-ignore
                obj[`${index}-${year}`] = activities

                return obj
            }, {})

            setSteps({ ...steps, ...month })
        })
    }, [activities])

    return (
        <Box className={classes.root}>
            <Stepper orientation="vertical">
                {Object.keys(steps).map(el => (
                    <Step key={el}>
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
