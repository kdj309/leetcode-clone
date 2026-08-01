import Box from '@mui/material/Box';
import Layout from '../../UI/Layout';
import LoginForm from './Form';

function SignIn() {
  return (
    <Layout className='tw-flex tw-justify-center tw-items-center'>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoginForm></LoginForm>
      </Box>
    </Layout>
  );
}

export default SignIn;
