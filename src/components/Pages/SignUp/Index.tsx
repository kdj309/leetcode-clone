import Box from '@mui/material/Box';
import Layout from '../../UI/Layout';
import SignUpForm from './Form';

export default function SignUp() {
  return (
    <Layout className='tw-flex tw-justify-center tw-items-center'>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <SignUpForm></SignUpForm>
      </Box>
    </Layout>
  );
}
