import { SignIn } from "@clerk/nextjs";
import { AppBar, Button, Container, Toolbar, Typography, Box, Grid, Link} from "@mui/material";

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
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Typography variant="h4" >Sign In</Typography>
                <SignIn />
                
            </Box>
            
        </Container>
    )
}