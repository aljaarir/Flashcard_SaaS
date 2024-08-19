'use client'

import { AppBar, Button, Container, Toolbar, Typography, Box, Grid} from "@mui/material";
import getStripe from "@/utils/get-stripe";
import Head from "next/head";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";


export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  };
  
  
  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="A SaaS app for creating and studying flashcards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{flexGrow:1}} component="div" sx={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Hero content */}
      <Box sx={{textAlign: 'center', my: 4}}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button variant="contained" color="primary" sx={{mt: 2, mr: 2}} href="/generate">
          Get Started
        </Button>
        <Button variant="outlined" color="primary" sx={{mt: 2}}>
          Learn More
        </Button>
      </Box>
      
      {/* Feature items */}
      <Box sx={{my: 6}}>
        <Typography textAlign= 'center' variant="h4" component="h2" gutterBottom>Features</Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h5" component="h3" gutterBottom textAlign='center'>Flashcard Generation</Typography>
            <Typography variant="body1" gutterBottom textAlign='center'>
              Create flashcards from your text with a single click.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h5" component="h3" gutterBottom textAlign='center'>Study Mode</Typography>
            <Typography variant="body1" gutterBottom textAlign='center'>
              Study your flashcards in a clean, distraction-free interface.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h5" component="h3" gutterBottom textAlign='center'> Accessible Anywhere</Typography>
            <Typography variant="body1" gutterBottom textAlign='center'>
              Access your flashcards from any device, anywhere in the world. Study on the go!
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{my: 6, textAlign: 'center'}}>
        <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{p:3, border:'1px solid', borderColor: 'grey.300', borderRadius:2}}>
            <Typography variant="h5" component="h3" gutterBottom>Free</Typography>
            <Typography variant="h6" component="p" gutterBottom>Forever</Typography>
            <Typography variant="body1" gutterBottom>
              Create up to 5 flashcards per day.
            </Typography>
            <Button variant="contained" color="primary" sx={{mt: 2}} href="/generate">Get Started</Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{p:3, border:'1px solid', borderColor: 'grey.300', borderRadius:2}}>
              <Typography variant="h5" component="h3" gutterBottom>Pro</Typography>
              <Typography variant="h6" component="p" gutterBottom>$10/month</Typography>
              <Typography variant="body1" gutterBottom>
                Unlimited flashcards and storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}}onClick={handleSubmit}>Subscribe</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

    </Container>
  )
}