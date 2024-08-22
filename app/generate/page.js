'use client'

import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CardActionArea,
} from '@mui/material'
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore'
import { db } from '@/firebase' // Adjust the import path accordingly
import { useUser } from '@clerk/nextjs'
import { createTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

const theme = createTheme({
  palette: {
    primary: {
      light: '#676fgd',
      main: '#424769',
      dark: '#2d3250',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#AD81A7',
      main: '#6C5E82',
      dark: '#2E365A',
      contrastText: '#F8C19B',
    },
  },
});

export default function Generate() {
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])
  const {isLoaded, isSignedIn, user} = useUser()
  const [name, setName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!isSignedIn) {
      alert('Please sign in to generate flashcards.')
      router.push('/sign-in')
  
      return
    }
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      })

      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }

      const data = await response.json()
      setFlashcards(data)
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
    }
  }

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
        ...prev,
        [id]: !prev[id]
    }))
  }

  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)

  const saveFlashcards = async () => {
    if (!name.trim()) {
      alert('Please enter a name for your flashcard set.')
      return
    }

    
      
      const userDocRef = doc(collection(db, 'users'), user.id)
      const userDocSnap = await getDoc(userDocRef)

      const batch = writeBatch(db)

      if (userDocSnap.exists()) {
        const collections = userDocSnap.data().flashcards || []
        if (collections.find((f) => f.name === name)) {
          alert('A flashcard set with the same name already exists. Please choose a different name.')
          return
        }
        else {
          collections.push({name})
          batch.set(userDocRef, { flashcards: collections }, {merge: true})
        }
        
      } else {
        batch.set(userDocRef, { flashcards: [{name}] })
      }
      
      const colRef = collection(userDocRef, name)
      flashcards.forEach((flashcard) => {
        const cardDocRef = doc(colRef)
        batch.set(cardDocRef, flashcard)
      })

      await batch.commit()
      alert('Flashcards saved successfully!')
      handleCloseDialog()
      setName('')
      router.push('/flashcards')
    
  }

  return (
    <Container maxWidth="md">
      <Button 
        href="/" 
        sx={{
          mt: 2, 
          position: "flex",
          alignContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: theme.palette.primary.main, 
          color: theme.palette.primary.contrastText, 
          background: 'linear-gradient(90deg, #6C5E82 0%, #424769 100%)', 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            color: theme.palette.primary.contrastText,
          },
        }}>
        Return Home
      </Button>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom href="/generate">
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx= {{fontWeight: 'bold', color: '#424769', background: 'linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)'}}
        >
          Generate Flashcards
        </Button>
        {flashcards.length > 0 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="secondary" onClick={handleOpenDialog} sx= {{fontWeight: 'bold', color: '#424769', background: 'linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)'}}>
                Save Flashcards
            </Button>
        </Box>
        )}
        </Box>

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          
          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                    <CardActionArea onClick={() => handleCardClick(index)}>                   
                    <CardContent>
                        <Box sx={{perspective: '1000px', 
                            '& > div': {
                                transition: 'transform 0.6s',
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
                                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                backfaceVisibility: 'hidden',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 2,
                                boxSizing: 'border-box',
                            },
                            '& > div > div:nth-of-type(2)': {
                                transform: 'rotateY(180deg)',
                            },
                        }}>
                            <div>
                                <div>
                                    <Typography variant="h5" component="div">
                                    {flashcard.front}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="h5" component="div">
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
        </Box>
      )}

        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
            <DialogContentText>
            Please enter a name for your flashcard set.
            </DialogContentText>
            <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={saveFlashcards} color="primary">
            Save
            </Button>
        </DialogActions>
        </Dialog>

    </Container>
  )
}
