import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { SyntheticEvent, useEffect, useState } from 'react';
import FamilyTabPanel from '../FamilyTabPanel/FamilyTabPanel';
import { FamilyWithUsersInterface } from '../../Api/apiInterface';
import UserMealsCard from '../UserMealsCard/UserMealsCard';
import { Dayjs } from 'dayjs';
import { useMeal } from '../MealContext/MealContext';
import FamilyMealsCard from '../FamilyMealsCard/FamilyMealsCard';
interface FamilyTabsProps {
    data: FamilyWithUsersInterface[];
    selectedDate: Dayjs;
}

const FamilyTabs: React.FC<FamilyTabsProps> = ({ data, selectedDate }) => {
    const familiesAsCook = data.filter(fu => fu.familyRole === "Cook");
    const {
        selectedFamily,
        setSelectedFamily,
    } = useMeal();

    const initialValue = familiesAsCook[0]?.familyId;
    const [value, setValue] = useState<number>(selectedFamily ? selectedFamily?.familyId : initialValue);

    useEffect(() => {
        if(!selectedFamily) setSelectedFamily(familiesAsCook[0]);
    }, [familiesAsCook, setSelectedFamily]);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        const family = familiesAsCook.find(fu => fu.familyId === newValue);
        setValue(newValue);
        setSelectedFamily(family!);
    };

    if (familiesAsCook.length <= 0) return (<>No families meal plans to manage</>);

    return (
        <Box sx={{ bgcolor: 'background.paper' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="families-meals-tabs"
            >
                {familiesAsCook.map((fu, index) => (
                    <Tab
                        key={index}
                        label={fu.familyName}
                        value={fu.familyId}
                    />
                ))}
            </Tabs>
            {familiesAsCook.map((fu, index) => (
                <FamilyTabPanel
                    key={index}
                    value={value}
                    index={fu.familyId}
                >
                    <FamilyMealsCard key={index} mealDate={selectedDate.toDate()} data={selectedFamily} />
                    {fu.familyUsers.map(
                        (user, index) => (
                            <UserMealsCard key={index} mealDate={selectedDate.toDate()} data={user} />
                        )
                    )}

                </FamilyTabPanel>
            ))}
        </Box>
    );
}

export default FamilyTabs;
