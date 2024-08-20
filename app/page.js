'use client'
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Container, Toolbar, Typography, Button, Box, Grid } from "@mui/material";
import Head from "next/head";

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSessionJson.statusCode === 500) {
      alert('An error occurred. Please try again later.')
      return
    }

    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    })

    if (error) {
      alert(error.message)
    }
  }

  return (
    <Container
      maxWidth="100vw"
      style={{
        padding: 0,
      }}>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create Flashcard from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>Flashcard SaaS</Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Sign In</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "110px",
            }}
            >
              <Button color="inherit" href="/generate">Create</Button>
              <UserButton />
            </Box>

          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{
        textAlign: "center",
        mt: 4,
        my: 4,
      }}>
        <Typography variant="h2" sx={{
          my: 2,
        }}>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5">
          The easiest way to create flashcards from your text
        </Typography>
        <SignedIn>
          <Button
            variant="contained"
            color="primary"
            href={"/generate"}
            sx={{
              my: 2,
            }}>
            Get Started
          </Button>
        </SignedIn>
        <SignedOut>
          <Button
            variant="contained"
            color="primary"
            href={"/sign-in"}
            sx={{
              my: 2,
            }}>
            Get Started
          </Button>
        </SignedOut>
      </Box>
      <Box sx={{
        my: 6,
        mx: 4,
      }}>
        <Box sx={{
          textAlign: "center",
        }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Features
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>Easy Text Input</Typography>
            <Typography>
              {' '}
              Simply paste your text and we will generate flashcards for you. Creating flashcards has never been easier.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>Smart Flashcards</Typography>
            <Typography>
              {' '}
              Our AI will generate flashcards that are easy to understand and remember. You can also customize the flashcards to fit
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>Accessible Anywhere</Typography>
            <Typography>
              {' '}
              You can access your flashcards from anywhere. You can also share your flashcards with friends and family.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{
        my: 6,
        mx: 4,
      }}>
        <Box sx={{
          textAlign: "center",
        }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Pricing
          </Typography>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{
              p: 3,
              border: "1px solid",
              borderColor: "grey.300",
              borderRadius: 2,
            }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Basic</Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>$5 / month</Typography>
              <Typography>
                {' '}
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>Subscribe</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{
              p: 3,
              border: "1px solid",
              borderColor: "grey.300",
              borderRadius: 2,
            }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Pro</Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>$10 / month</Typography>
              <Typography>
                {' '}
                Unlimited flashcard features and storage, with priority support.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleSubmit}
              >Subscribe</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
