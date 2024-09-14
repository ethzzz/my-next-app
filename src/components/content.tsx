import styles from './content.module.scss'
import { ImmerFunction } from '@/components/Function/ImmerFunction'
import { ForwardRef} from "@/components/Function/ForwardRef";
import { UseMemo} from "@/components/Function/UseMemo";

export function Content() {
    return (
        <div className={`${styles['content']}`}>
            <ImmerFunction />
            <ForwardRef />
            <UseMemo />
        </div>
    )
}