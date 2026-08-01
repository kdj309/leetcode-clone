import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React from 'react';
import { a11yProps } from '../../utils/helpers';
interface TabsProps {
  tabs: string[];
  className?: string;
  writingMode?: 'horizontal-tb' | 'vertical-rl' | 'vertical-lr' | 'sideways-rl' | 'sideways-lr';
  value: any;
  orientation?: 'vertical' | 'horizontal';
  onChange: ((event: React.SyntheticEvent, value: any) => void) | undefined;
}
const CustomTabs: React.FC<TabsProps> = ({
  tabs,
  className,
  writingMode = 'horizontal-tb',
  value,
  orientation = 'horizontal',
  onChange,
}) => {
  return (
    <Tabs value={value} onChange={onChange} orientation={orientation}>
      {tabs.map((tab, id) => (
        <Tab
          key={`${tab}${id}`}
          className={className}
          sx={{ writingMode: writingMode }}
          label={tab}
          {...a11yProps(id)}
        ></Tab>
      ))}
    </Tabs>
  );
};
export default CustomTabs;
