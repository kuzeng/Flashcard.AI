import { Toolbar, AppBar, Container, Typography, Button, Box } from '@mui/material';
import { SignUp } from "@clerk/nextjs";
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <Container maxWidth="100vw" style={{
      padding: 0,
    }}>
       <AppBar position="static" style={{ backgroundColor: '#2c3e50', borderBottom: '3px solid gold' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>Flashcard SaaS</Typography>
          <Button color="inherit">
            <Link href="/sign-in" passHref>
            <Typography variant="body" sx={{
              color: 'white',
            }}>Sign In</Typography>
            </Link>
          </Button>
          <Button color="inherit">
            <Link href="/sign-up" passHref>
            <Typography variant="body" sx={{
              color: 'white',
            }}>Sign Up</Typography>
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          mt: 4,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" sx={{
          mb: 2,
        }}>
          Sign Up
        </Typography>
        <SignUp />
      </Box>
    </Container>
  );
}