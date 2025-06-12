import styles from './content.module.scss'
import { ImmerFunction } from '@/components/functions/ImmerFunction'
import { ForwardRef} from "@/components/functions/ForwardRef";
import { UseMemo} from "@/components/functions/UseMemo";
import { Closures} from "@/components/functions/Closures";
import { SuspenseFunction } from "@/components/functions/SuspenseFunction";

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