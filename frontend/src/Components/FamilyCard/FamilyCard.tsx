import { FamilyUserInterface, FamilyWithUsersInterface, MealDetailsInterface } from "../../Api/apiInterface";
import { Avatar, Card, CardContent, CardHeader, CardMedia, List, ListItem, ListItemAvatar, ListItemText, Select, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import FamilyRoleSelectBox from "../FamilyRoleSelectBox/FamilyRoleSelectBox";
import { updateFamilyRole } from "../../Api/api";
import StatusHandler from "../StatusHandler/StatusHandler";

interface FamilyUsersProps {
    data: FamilyUserInterface[];
    familyName: string;
    currentUserRole: string;
    roles: string[];
}

const FamilyCard: React.FC<FamilyUsersProps> = ({ data, familyName, currentUserRole, roles }) => {
    const [familyUsers, setFamilyUsers] = useState<FamilyUserInterface[]>(data);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const handleRoleChange = (index: number, newRole: string, familyId: number, userId: number) => {
        const updatedUsers = [...familyUsers];
        updatedUsers[index].familyRole = newRole;
        setFamilyUsers(updatedUsers);

        updateFamilyRole({ familyId, userId, newRole })
            .then(response => {
                if (response.statusText === "OK") {
                    setStatus("success");
                }
            })
            .catch(error => {
                const errorMessage = error?.response?.data?.message || "Error updating family role";
                setStatus("error");
                setErrorMessages([...errorMessages, errorMessage]);
            });
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
                                <StatusHandler
                                    status={status}
                                    errorMessages={errorMessages}
                                    loadingMessage="Updating family role ..."
                                    successMessage=""
                                >
                                    {currentUserRole === "Cook" &&
                                        <FamilyRoleSelectBox
                                            defaultRole={fu.familyRole}
                                            roles={roles}
                                            onRoleChange={(newRole: string) => handleRoleChange(index, newRole, fu.familyId, fu.userId)}
                                        />}
                                </StatusHandler>
                                {currentUserRole !== "Cook" && fu.familyRole}
                            </ListItem>
                        )
                    )}
                </List>
            </CardContent>
        </Card >
    )
}

export default FamilyCard;