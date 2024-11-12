import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en-gb';
import { useState } from "react";
import { AppBar, Box,  IconButton, TextField, Toolbar, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useMeal } from "../MealContext/MealContext";

interface DateBarProps {
    selectedDate: Dayjs,
    setSelectedDate: (newDate: Dayjs) => void;
}

const DateBar: React.FC<DateBarProps> = ({selectedDate, setSelectedDate}) => {
    const [open, setOpen] = useState(false);
    const {setMealDate} = useMeal();

    const handlePreviousDate = () => {
        setSelectedDate(selectedDate.subtract(1, 'day'));
        setMealDate(selectedDate.subtract(1, 'day').format('YYYY-MM-DD'));
    };

    const handleNextDate = () => {
        setSelectedDate(selectedDate.add(1, 'day'));
        setMealDate(selectedDate.add(1, 'day').format('YYYY-MM-DD'));
    };

    const handleOpenDatePicker = () => {
        setOpen(true);
    };

    const browserLocale = navigator.language.toLowerCase();

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={browserLocale}>
            <AppBar position="static" aria-label="Date Bar">
                <Toolbar color="primary">
                    <IconButton edge="start" color="inherit" onClick={handlePreviousDate}>
                        <ArrowBackIcon />
                    </IconButton>

                    <Box flexGrow={1} display="flex" justifyContent="center" onClick={handleOpenDatePicker}>
                        <Typography variant="h6" style={{ cursor: 'pointer' }}>
                            {selectedDate.format('DD MMMM YYYY, ddd')}
                        </Typography>
                    </Box>

                    <IconButton edge="end" color="inherit" onClick={handleNextDate}>
                        <ArrowForwardIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <DatePicker
                open={open}
                value={selectedDate}
                onChange={(newValue) => { setSelectedDate(newValue!); setOpen(false); }}
                onClose={() => setOpen(false)}
                slots={{ textField: (props) => <TextField {...props} style={{ display: 'none' }} /> }} 
                slotProps={{
                  textField: {
                    inputProps: { style: { display: 'none' } }, 
                  },
                }}
            />
        </LocalizationProvider>
    )
}

export default DateBar;
