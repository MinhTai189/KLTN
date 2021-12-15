import { Activity } from 'models';

export interface ActivitiesInYears {
  [key: string]: Array<Activity | null>;
}
