'use client'
import { SignIn } from "@clerk/nextjs";
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
            <AppBar position="static" >
                <Toolbar>
                    <Typography variant="h6" style={{flexGrow:1}} component="div" sx={{ flexGrow: 1 }}>
                        Flashcard SaaS
                    </Typography>
                    <Button color="inherit">
                        <Link href="/sign-in" passHref>
                            Login
                        </Link>
                    </Button>
                    <Button color="inherit">
                        <Link href="/sign-up" passHref>
                            Sign Up
                        </Link>
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
                    backgroundColor: theme.palette.secondary.contrastText, 
                    color: theme.palette.primary.main, 
                    '&:hover': {
                    backgroundColor: theme.palette.secondary.contrastText,
                    color: theme.palette.primary.main,
                    },
                }}>
                Back Page
            </Button>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Typography variant="h4" >Sign In</Typography>
                <SignIn />
                
            </Box>
            
        </Container>
    )
}