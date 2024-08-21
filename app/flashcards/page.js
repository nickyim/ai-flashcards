'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import { Container, Card, CardActionArea, CardContent, Grid, Typography, Box, AppBar, Toolbar, Button, Stack } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const theme = createTheme({
    palette: {
        primary: {
            main: "#6200EA",
        },
        secondary: {
            main: "#00BFA5",
        },
        background: {
            default: "#F5F5F5",
        },
    },
});

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    const handleGoHome = () => {
        router.push("/welcome");
    };
    
    useEffect(() => {
        async function getFlashcards() {
            if (!user) {
                return
            }
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                console.log(collections)
                setFlashcards(collections)
            } else {
                await setDoc(docRef, { flashcards: [] })
            }
        }
        getFlashcards()
    }, [user])

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed" sx={{ background: "primary.main" }}>
                    <Toolbar variant="dense">
                        <Typography
                            variant="h6"
                            style={{ flexGrow: 1, fontWeight: "bold" }}
                        >
                            FlashAI
                        </Typography>
                        <SignedOut>
                            <Button
                                color="primary"
                                onClick={handleGoHome}
                                sx={{
                                    fontWeight: "bold",
                                    backgroundColor: "#b8d0eb",
                                    borderRadius: 2,
                                    width: "150px",
                                    "&:hover": {
                                        backgroundColor: "#a9d6e5",
                                        transform: "translateY(-1px)",
                                        boxShadow: 3,
                                    },
                                }}
                            >
                                Go Home
                            </Button>
                        </SignedOut>
                        <SignedIn>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    color="primary"
                                    onClick={handleGoHome}
                                    sx={{
                                        fontWeight: "bold",
                                        backgroundColor: "#b8d0eb",
                                        borderRadius: 2,
                                        width: "150px",
                                        "&:hover": {
                                            backgroundColor: "#a9d6e5",
                                            transform: "translateY(-1px)",
                                            boxShadow: 3,
                                        },
                                    }}
                                >
                                    Go Home
                                </Button>
                                <UserButton />
                            </Stack>
                        </SignedIn>
                    </Toolbar>
                </AppBar>
                <Box 
                    sx={{ 
                        background: "linear-gradient(to bottom, #eaf4f4, #a9d6e5)", 
                        minHeight: '100vh', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        padding: 4,
                        mt: 8  // Add margin to prevent content from hiding behind the AppBar
                    }}
                >
                    <Container maxWidth="md">
                        <Typography variant="h3" color="primary.main" fontWeight="bold" textAlign="center" mb={4}>
                            My Collection
                        </Typography>
                        {flashcards.length === 0 ? (
                            <Box sx={{ textAlign: 'center', mt: 6 }}>
                                <Typography variant="h6" color="text.secondary">
                                    No flashcards sets found. Start generating some flashcards!
                                </Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={3}>
                                {flashcards.map((flashcard, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card>
                                            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                                <CardContent>
                                                    <Typography variant="h6" color="primary.main">
                                                        {flashcard.name}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
