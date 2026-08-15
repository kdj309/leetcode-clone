import { TabPanelProps } from '../../utils/types';

export default function CustomTabPanel(props: TabPanelProps) {
  const { children, value, innerDivClassName, wrapperClassName, index, group, ...other } = props;

  return (
    <div
      hidden={value !== index}
      id={`${group}-tabpanel-${index}`}
      aria-labelledby={`${group}-tab-${index}`}
      className={wrapperClassName ?? ''}
      role='tabpanel'
      {...other}
    >
      {value === index && <div className={innerDivClassName ?? ''}>{children}</div>}
    </div>
  );
}
