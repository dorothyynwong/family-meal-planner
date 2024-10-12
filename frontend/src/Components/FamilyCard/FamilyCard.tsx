import { FamilyUserInterface, FamilyWithUsersInterface, MealDetailsInterface } from "../../Api/apiInterface";
import { Avatar, Card, CardContent, CardHeader, CardMedia, List, ListItem, ListItemAvatar, ListItemText, Select, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import FamilyRoleSelectBox from "../FamilyRoleSelectBox/FamilyRoleSelectBox";

interface FamilyUsersProps {
    data: FamilyUserInterface[];
    familyName: string;
    currentUserRole: string;
    roles: string[];
}

const FamilyCard: React.FC<FamilyUsersProps> = ({ data, familyName,  currentUserRole, roles }) => {
    const [familyUsers, setFamilyUsers] = useState<FamilyUserInterface[]>(data);

    const handleRoleChange = (index: number, newRole: string) => {
        const updatedUsers = [...familyUsers];
        updatedUsers[index].familyRole = newRole; 
        setFamilyUsers(updatedUsers);
        // You can also call an API to update the role in the backend here
    };
    const handleClick = () => {

    }

    return (
        <Card sx={{ maxWidth: 345, m: 2 }} onClick={handleClick}>
            <CardHeader title={familyName} />
            <CardContent>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {familyUsers.map(
                        (fu, index) => (
                            <ListItem key={index} alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar>{fu.userNickName}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={fu.userNickName}
                                />
                                {currentUserRole==="Cook" && 
                                <FamilyRoleSelectBox 
                                    defaultRole={fu.familyRole} 
                                    roles={roles}
                                    onRoleChange={(newRole: string) => handleRoleChange(index, newRole)} 
                                />}

                                {currentUserRole!=="Cook" && fu.familyRole} 
                            </ListItem>
                        )
                    )}
                </List>
            </CardContent>
        </Card >
    )
}

export default FamilyCard;