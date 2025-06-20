import styles from './content.module.scss'
import { ImmerFunction } from '../functions/ImmerFunction'
import { ForwardRef} from "../functions/ForwardRef";
import { UseMemo} from "../functions/UseMemo";
import { Closures} from "../functions/Closures";
import { SuspenseFunction } from "../functions/SuspenseFunction";

export function Content() {
    return (
        <div className={`${styles['content']}`}>
            <ImmerFunction />
            <ForwardRef />
            <UseMemo />
            <Closures />
            <SuspenseFunction />
        </div>
    )
}