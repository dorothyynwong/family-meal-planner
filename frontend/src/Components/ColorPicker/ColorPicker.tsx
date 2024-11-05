import React, { useState } from 'react';
import { ChromePicker, ColorResult } from 'react-color';

interface ColorPickerProps {
    selectedColor: string;
    setSelectedColor: (newColor: string) => void;
    onChange?: (color: ColorResult) => void;
}

interface PopoverStyles {
    position: 'absolute';
    zIndex: number;
}

interface CoverStyles {
    position: 'fixed';
    top: string;
    right: string;
    bottom: string;
    left: string;
}

const ButtonExample: React.FC<ColorPickerProps> = ({ selectedColor, setSelectedColor,
    onChange
}) => {
    const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);


    const handleClick = (): void => {
        setDisplayColorPicker(!displayColorPicker);
    };

    const handleClose = (): void => {
        setDisplayColorPicker(false);
    };

    const handleColorChange = (color: ColorResult): void => {
        setSelectedColor(color.hex);
        if (onChange) {
            onChange(color);
        }
    };

    const popover: PopoverStyles = {
        position: 'absolute',
        zIndex: 2,
    };

    const cover: CoverStyles = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    };

    return (
        <div>
            <button
                onClick={handleClick}
                className="px-4 py-2 text-white rounded"
                style={{ backgroundColor: selectedColor }}
            >
                Pick a Color
            </button>
            {displayColorPicker && (
                <div style={popover}>
                    <div style={cover} onClick={handleClose} />
                    <div className="bg-white p-4 rounded shadow-lg">
                        <ChromePicker
                            color={selectedColor}
                            onChange={handleColorChange}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ButtonExample;