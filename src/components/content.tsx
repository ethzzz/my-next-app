import styles from './content.module.scss'
import { ImmerFunction } from '@/components/Functions/ImmerFunction'
import { ForwardRef} from "@/components/Functions/ForwardRef";
import { UseMemo} from "@/components/Functions/UseMemo";
import { Closures} from "@/components/Functions/Closures";
import { SuspenseFunction } from "@/components/Functions/SuspenseFunction";

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