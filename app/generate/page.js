'use client';

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, collection, setDoc, getDoc, writeBatch } from "firebase/firestore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Paper, Container, CircularProgress, TextField, Grid, Card, CardActions, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box, CardActionArea, DialogContentText } from '@mui/material';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from "next/head";

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    fetch('api/generate', {
      method: 'POST',
      body: text,
    })
      .then(res => {
        setLoading(false);
        return res.json()
      }
      )
      .then(data => setFlashcards(data))
  }

  const handleCardClick = (index) => {
    setFlipped(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const saveFlashcards = async () => {
    if (!name) {
      alert('Please enter a name');
      return;
    }

    const batch = writeBatch(db)
    const userDocRef = doc(db, 'users', user.id)
    const docSnap = await getDoc(userDocRef)

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || []
      if (collections.find(collection => collection.name === name)) {
        alert('Collection name already exists');
        return;
      } else {
        collections.push({ name })
        batch.set(userDocRef, { flashcards: collections }, { merge: true })
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] })
    }

    const colRef = collection(userDocRef, name)
    flashcards.forEach(flashcard => {
      const cardDocRef = doc(colRef)
      batch.set(cardDocRef, flashcard)
    })

    await batch.commit()
    handleClose()
    router.push('/flashcards')
  }

  return (
    <Container
      maxWidth="100vw"
      style={{
        padding: 0,
      }}
    >
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create Flashcard from your text" />
      </Head>

      <AppBar position="static" style={{ backgroundColor: '#2c3e50', borderBottom: '3px solid gold'}}>
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
              width: "170px",
            }}
            > 
              <Button color="inherit" href="/">Home</Button>
              <Button color="inherit" href="/generate">Create</Button>
              <UserButton />
            </Box>

          </SignedIn>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">

        <Box sx={{
          mt: 4,
          mb: 6,
          display: 'flex',
          textAlign: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Typography variant="h4">
            Generate Flashcards
          </Typography>
          <Paper sx={{
            width: '100%',
            p: 4,
          }}>
            <TextField
              label="Enter text"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{
                mt: 2,
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{
                my: 2,
                backgroundColor: 'gold', // Hogwarts gold
                '&:hover': {
                  backgroundColor: 'darkgoldenrod',
                },
              }}
            >
              Generate
            </Button>
          </Paper>
        </Box>

        {loading && (
          <Container
            maxWidth="100vw"
            sx={{
              textAlign: "center",
              mt: 4,
            }}
          >
            <CircularProgress />
            <Typography variant="h6">Generating your new flashcards...</Typography>
          </Container>
        )}

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5">Flashcards Preview</Typography>
            <Grid container spacing={3}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardActionArea onClick={() => handleCardClick(index)}>
                      <CardContent>
                        <Box sx={{
                          perspective: '1000px',
                          '& > div': {
                            transition: '0.6s',
                            transformStyle: 'preserve-3d',
                            position: 'relative',
                            width: '100%',
                            height: '200px',
                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                            transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          },
                          '& > div > div': {
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 2,
                            boxSizing: 'border-box',
                          },
                          '& > div > div:nth-of-type(2)': {
                            transform: 'rotateY(180deg)',
                          }
                        }}>
                          <div>
                            <div>
                              <Typography variant="h6" component="div">
                                {flashcard.front}
                              </Typography>
                            </div>
                            <div>
                              <Typography variant="body" component="div">
                                {flashcard.back}
                              </Typography>
                            </div>
                          </div>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{
              my: 4,
              display: 'flex',
              justifyContent: 'center',
            }}>
              <Button variant="contained" color="primary" onClick={handleOpen} sx={{
                              my: 2,
                              backgroundColor: 'gold', // Hogwarts gold
                              '&:hover': {
                                backgroundColor: 'darkgoldenrod',
                              },
              }}>Save</Button>
            </Box>
          </Box>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            Save Flashcards
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your flashcard collection
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Collection Name"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={saveFlashcards}>Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Container>

  );
}