import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { SyntheticEvent, useState } from 'react';
import FamilyTabPanel from '../FamilyTabPanel/FamilyTabPanel';
import { FamilyWithUsersInterface } from '../../Api/apiInterface';

interface FamilyTabsProps {
    data: FamilyWithUsersInterface[];
}

const FamilyTabs: React.FC<FamilyTabsProps> = ({ data }) => {
    const [value, setValue] = useState(0);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: 'background.paper' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="families-meals-tabs"
            >
                {data.map((fu, index) => (
                    <Tab label={fu.familyName}
                        // key={index}
                        // data={fu}
                        // familyId={fu.familyId}
                        // userId={fu.userId}
                        // roles={familyRoles}
                    />
                ))}
            </Tabs>
            {data.map((fu, index) => (
                    <FamilyTabPanel 
                        value={value}
                        index={index}
                        // key={index}
                        // data={fu}
                        // familyId={fu.familyId}
                        // userId={fu.userId}
                        // roles={familyRoles}
                    >
                    {fu.familyShareCode}
                    </FamilyTabPanel>
                ))}
        </Box>
    );
}

export default FamilyTabs;
