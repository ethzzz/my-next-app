import styles from './content.module.scss'
import { ImmerFunction } from '@/components/Function/ImmerFunction'
import { ForwardRef} from "@/components/Function/ForwardRef";
import { UseMemo} from "@/components/Function/UseMemo";
import { Closures} from "@/components/Function/Closures";
import { SuspenseFunction } from "@/components/Function/Suspense";

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