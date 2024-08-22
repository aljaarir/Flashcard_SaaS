'use client'

import { SignUp } from "@clerk/nextjs";
import { AppBar, Button, Container, Toolbar, Typography, Box, Grid, Link} from "@mui/material";
import { createTheme } from '@mui/material/styles';

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

export default function SignUpPage() {
    return (
        <Container maxWidth="sm">
            <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #6C5E82 0%, #424769 100%)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <Toolbar>
                    <Typography variant="h6" style={{flexGrow:1}} component="div" sx={{ flexGrow: 1 }}>
                        Flashcard SaaS
                    </Typography>
                    <Button color="inherit" href="/sign-in" sx={{ fontWeight: 'bold' }}>
                            Login                      
                    </Button>
                    
                </Toolbar>
            </AppBar>
            <Button 
                maxWidth="100vw"
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
                Back Page
            </Button>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Typography variant="h4" >Sign Up</Typography>
                <SignUp />
                
            </Box>
            
        </Container>
    )
}