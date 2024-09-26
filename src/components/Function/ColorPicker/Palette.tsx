import type { FC } from 'react';
import { Color } from './color';

const Palette: FC<{ color: Color }> = ({ color }) => {
    return (
        <div className="color-picker-panel-palette">
            <div
                className="color-picker-panel-palette-main"
                style={{
                    backgroundColor: `hsl(${color.toHsl().h},100%,50%`,
                    backgroundImage: 'linear-gradient(0deg, #000, transparent),linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0))'
                }}
            >
            </div>
        </div>
    )
}

export default Palette