import {
  Drawer,
  List,
  Typography,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Stack,
  IconButton,
  capitalize,
} from '@mui/material';
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
  const currentIndex = problemname?.slice(24);
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
        <IconButton onClick={() => toggleDrawer()}>
          <CloseOutlinedIcon />
        </IconButton>
      </Stack>
      <Divider />
      <List>
        {currentIndex != undefined &&
          problems.map((p, id) => {
            return (
              <ListItem
                key={p._id}
                disablePadding
                sx={{
                  gap: 2,
                  backgroundColor: id + 1 === parseInt(currentIndex) ? bgColor : 'background.default',
                  color: id + 1 === parseInt(currentIndex) ? color : colorMode === 'dark' ? 'common.white' : 'initial',
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
