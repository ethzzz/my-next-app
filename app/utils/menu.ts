
import type { MenuItem } from "@/app/types/menu";

export const flatMenuItems = (menu: MenuItem[]): MenuItem[] => {
    const items: MenuItem[] = [];
    
    menu.forEach(item => {
        if(item.name){
            items.push({
                ...item
            })
        }
        
        if(item.children && item.children.length > 0) {
            items.push(...flatMenuItems(item.children));
        }
    })
    return items;
}

