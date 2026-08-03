import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import capitalize from '@mui/material/utils/capitalize';
import { SavedProblems } from '../../utils/types';
import { useNavigate, useParams } from 'react-router-dom';
import { difficultyColors } from '../../constants/Index';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { usethemeUtils } from '../../context/ThemeWrapper';

export default function CustomDrawer({
  open,
  problems,
  toggleDrawer,
}: {
  open: boolean;
  problems: SavedProblems[];
  toggleDrawer: () => void;
}) {
  const navigate = useNavigate();
  const { problemname } = useParams();
  const problemTitle = problemname?.slice(0, 24);
  const { colorMode } = usethemeUtils();
  const bgColor = colorMode === 'light' ? 'common.black' : 'common.white';
  const color = colorMode === 'light' ? 'common.white' : 'common.black';

  return (
    <Drawer
      PaperProps={{
        sx: { width: '30%', backgroundColor: 'background.default', scrollbarWidth: 'thin' },
      }}
      open={open}
      onClose={() => toggleDrawer()}
    >
      <Stack margin={2} flexDirection='row' justifyContent='space-between' alignItems='center'>
        <Typography variant='subtitle1'>Problems List</Typography>
        <IconButton size='small' onClick={() => toggleDrawer()}>
          <CloseOutlinedIcon fontSize='small' />
        </IconButton>
      </Stack>
      <Divider />
      <List>
        {problems.map((p, id) => {
          return (
            <ListItem
              key={p._id}
              disablePadding
              sx={{
                gap: 2,
                backgroundColor: p._id === problemTitle ? bgColor : 'background.default',
                color: p._id === problemTitle ? color : colorMode === 'dark' ? 'common.white' : 'initial',
              }}
            >
              <ListItemButton
                onClick={() => {
                  navigate(`/problems/${p._id}${id + 1}`);
                }}
              >
                <ListItemText primary={<Typography variant='body2'>{p.title}</Typography>} />
                <Typography variant='body2' style={{ color: difficultyColors[p.difficulty] }}>
                  {capitalize(p.difficulty)}
                </Typography>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
