import { useEffect, useState } from "react";
import { FamilyWithUsersInterface } from "../../Api/apiInterface";
import { getFamiliesWithUsersByUserId, getFamilyRoleTypes } from "../../Api/api";
import FamilyTabs from "../../Components/FamilyTabs/FamilyTabs";
import StatusHandler from "../../Components/StatusHandler/StatusHandler";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en-gb';

const FamilyMealDaily: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [familyUsersList, setFamilyUsersList] = useState<FamilyWithUsersInterface[]>([]);
    const [familyRoles, setFamilyRoles] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    // const browserLocale = navigator.language;
    // console.log(browserLocale);

    useEffect(() => {
        setStatus("loading");
        setErrorMessages([]);
        getFamilyRoleTypes().then(response => {
            const roles = response.data;
            setFamilyRoles(roles);
        });

        getFamiliesWithUsersByUserId()
            .then(fu => {
                setFamilyUsersList(fu.data);
                setStatus("success");
            })
            .catch(error => {
                console.log("Error getting families with users", error);
                const errorMessage = error?.response?.data?.message || "Error getting families with users";
                setStatus("error");
                setErrorMessages([...errorMessages, errorMessage]);
            });
    }, []);
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
            <StatusHandler
                status={status}
                errorMessages={errorMessages}
                loadingMessage="Getting recipes..."
                successMessage=""
            >
                <></>
            </StatusHandler>
            <DatePicker 
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)} />
            <FamilyTabs data={familyUsersList} />
            {/* {familyUsersList.map((fu, index) => (
                <FamilyTabs
                    key={index}
                    data={fu}
                    familyId={fu.familyId}
                    userId={fu.userId}
                    roles={familyRoles}
                />
            ))} */}
        </LocalizationProvider>
    );
}

export default FamilyMealDaily;
