import React, { useState } from 'react';
import styles from './tab.module.scss';

interface TabItem {
    name: string;
    component: JSX.Element;
}

interface TabProps {
    items: TabItem[];
}

export const Tab: React.FC<TabProps> = ({ items }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className={styles['tab-container']}>
            {/* Tab Header */}
            <div className={styles['tab-header']}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`${styles['tab-item']} ${
                            activeTab === index ? styles['active'] : ''
                        }`}
                        onClick={() => setActiveTab(index)}
                    >
                        {item.name}
                    </div>
                ))}
            </div>

            {/* Tab Content */}
            <div className={styles['tab-content']}>
                {items[activeTab]?.component || <div>No content available</div>}
            </div>
        </div>
    );
};