import styles from './content.module.scss'
import { ImmerFunction } from '@/app/functions/ImmerFunction'
import { ForwardRef} from "@/app/functions/ForwardRef";
import { UseMemo} from "@/app/functions/UseMemo";
import { Closures} from "@/app/functions/Closures";
import { SuspenseFunction } from "@/app/functions/SuspenseFunction";

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