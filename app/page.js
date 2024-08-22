'use client'

import { AppBar, Button, Container, Toolbar, Typography, Box, Grid } from "@mui/material";
import getStripe from "@/utils/get-stripe";
import Head from "next/head";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    });
    const checkoutSessionJson = await checkoutSession.json();
  
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });
  
    if (error) {
      console.warn(error.message);
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ backgroundColor: '#f9f9f9', borderRadius: '12px', p: 4, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)' }}>
      <Head>
        <title>Flashcards4U</title>
        <meta name="description" content="A SaaS app for creating and studying flashcards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #6C5E82 0%, #424769 100%)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: '0.1em' }}>
            Flashcards4U
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in" sx={{ fontWeight: 'bold' }}>Login</Button>
            <Button color="inherit" href="/sign-up" sx={{ fontWeight: 'bold' }}>Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Hero content */}
      <Box sx={{ textAlign: 'center', my: 4, background: 'linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)', borderRadius: '12px', p: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#424769' }}>
          Welcome to Flashcards4U
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#6C5E82' }}>
        Turn your study grind into a memory game with Flashcards4U! Where mastering subjects is as easy as flipping a card!
        </Typography>
        <Button variant="contained" color="primary" sx={{ borderRadius: '10px', mt: 2, mr: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }} href="/generate">
          Get Started
        </Button>
        <Button variant="outlined" color="primary" sx={{ borderRadius: '10px', mt: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}>
          Learn More
        </Button>
      </Box>
      
      {/* Feature items */}
      <Box sx={{ my: 6 }}>
        <Typography textAlign='center' variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#424769' }}>Features</Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h5" component="h3" gutterBottom textAlign='center' sx={{ fontWeight: 'bold', color: '#6C5E82' }}>
              Flashcard Generation
            </Typography>
            <Typography variant="body1" gutterBottom textAlign='center' sx={{ color: '#333' }}>
            Transform your notes into powerful flashcards with just one click, making studying easier and more efficient.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h5" component="h3" gutterBottom textAlign='center' sx={{ fontWeight: 'bold', color: '#6C5E82' }}>
              Study Mode
            </Typography>
            <Typography variant="body1" gutterBottom textAlign='center' sx={{ color: '#333' }}>
            Immerse yourself in a clean, distraction-free interface that keeps you fully engaged in your study sessions.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h5" component="h3" gutterBottom textAlign='center' sx={{ fontWeight: 'bold', color: '#6C5E82' }}>
              Accessible Anywhere
            </Typography>
            <Typography variant="body1" gutterBottom textAlign='center' sx={{ color: '#333' }}>
              Keep your knowledge at your fingertips with seamless access across all your devices.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center', backgroundColor: '#424769', color: '#fff', borderRadius: '12px', p: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>Pricing</Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ p: 3, border: '2px solid', borderColor: '#fff', borderRadius: 2, backgroundColor: '#6C5E82' }}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>Free</Typography>
              <Typography variant="h6" component="p" gutterBottom sx={{ color: '#F8C19B' }}>Forever</Typography>
              <Typography variant="body1" gutterBottom>
                Create up to 5 flashcards per day.
              </Typography>
              <Button variant="contained" color="secondary" sx={{ borderRadius: '10px', mt: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }} href="/generate">Try it out!</Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ p: 3, border: '2px solid', borderColor: '#fff', borderRadius: 2, backgroundColor: '#6C5E82' }}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>Pro</Typography>
              <Typography variant="h6" component="p" gutterBottom sx={{ color: '#F8C19B' }}>$10/month</Typography>
              <Typography variant="body1" gutterBottom>
                Unlimited flashcards and storage.
              </Typography>
              <Button variant="contained" color="secondary" sx={{ borderRadius: '10px', mt: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }} onClick={handleSubmit}>Subscribe</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

    </Container>
  );
}
