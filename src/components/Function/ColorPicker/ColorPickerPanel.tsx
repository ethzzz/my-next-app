import { useState, CSSProperties } from "react";
import cs from 'classnames';
import './index.scss'
import { Color } from './color';
import { ColorType } from './interface';
import Palette from "./Palette";

export interface ColorPickerPanelProps {
    className?: string;
    style?: CSSProperties;
    value?: ColorType;
    onChange?: (color: Color) => void;
}

export function ColorPickerPanel(props:ColorPickerPanelProps){
    const {
        className,
        style,
        value,
        onChange,
    } = props;

    const [colorValue, setColorValue] = useState<Color>(()=>{
        if(value instanceof Color){
            return value;
        }
        return new Color(value);
    })

    const classNames = cs("color-picker", className)

    return (
        <div className={classNames} style={style} >
            <Palette color={colorValue}></Palette>
        </div>
    )
}