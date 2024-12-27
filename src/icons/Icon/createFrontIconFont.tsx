import React from 'react';
import { Icon, IconProps } from './'

const loadedSet = new Set<string>()

const createFrontIconFont = (scriptUrl: string) => {
    if(
        typeof scriptUrl === 'string'
        && typeof window !== 'undefined'
        && scriptUrl.length
        && !loadedSet.has(scriptUrl)
    ){
        const script = document.createElement('script');
        script.setAttribute('src', scriptUrl)
        script.setAttribute('data-namespace', scriptUrl)
        document.body.appendChild(script);
        loadedSet.add(scriptUrl);
    }
    const Iconfont = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
        const { type, ...rest } = props;

        return (
            <Icon {...rest} ref={ref}>
                { type ? <use xlinkHref={`#${type}`} /> : null}
            </Icon>
        );
    });
    Iconfont.displayName = 'Iconfont';

    return Iconfont;
}