import Tabs from '@mui/material/Tabs';
import React from 'react';
import Tab from '@mui/material/Tab';
import { a11yProps } from '../../utils/helpers';
interface TabsProps {
  tabs: string[];
  className?: string;
  writingMode?: 'horizontal-tb' | 'vertical-rl' | 'vertical-lr' | 'sideways-rl' | 'sideways-lr';
  value: any;
  orientation?: 'vertical' | 'horizontal';
  onChange: ((event: React.SyntheticEvent, value: any) => void) | undefined;
  group?: string;
}

const CustomTabs: React.FC<TabsProps> = ({
  tabs,
  className,
  writingMode = 'horizontal-tb',
  value,
  orientation = 'horizontal',
  onChange,
  group = 'custom-tabs',
}) => {
  return (
    <Tabs value={value} onChange={onChange} orientation={orientation}>
      {tabs.map((tab, id) => (
        <Tab key={id} value={id} label={tab} className={className} sx={{ writingMode }} {...a11yProps(group, id)} />
      ))}
    </Tabs>
  );
};
export default CustomTabs;
