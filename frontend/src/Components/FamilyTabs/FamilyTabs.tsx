import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { SyntheticEvent, useEffect, useState } from 'react';
import FamilyTabPanel from '../FamilyTabPanel/FamilyTabPanel';
import { FamilyUserInterface, FamilyWithUsersInterface } from '../../Api/apiInterface';
import MealDaily from '../MealDaily/MealDaily';
import UserMealsCard from '../UserMealsCard/UserMealsCard';
import dayjs, { Dayjs } from 'dayjs';
import { useMeal } from '../MealContext/MealContext';

interface FamilyTabsProps {
    data: FamilyWithUsersInterface[];
    selectedDate: Dayjs;
}

const FamilyTabs: React.FC<FamilyTabsProps> = ({ data, selectedDate }) => {
    const familiesAsCook = data.filter(fu => fu.familyRole === "Cook");
    const [value, setValue] = useState<number>(familiesAsCook[0]?.familyId);

    const {
        selectedFamilyId,
        setSelectedFamilyId,
    } = useMeal();

    useEffect(() => {
        if (familiesAsCook.length > 0 && !value) {
            setValue(familiesAsCook[0].familyId);
            setSelectedFamilyId(familiesAsCook[0].familyId);
        }
    }, [familiesAsCook, value, setSelectedFamilyId]);
    

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
        setSelectedFamilyId(newValue);
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
