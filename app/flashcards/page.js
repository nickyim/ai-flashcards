'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import { Container, Card, CardActionArea, CardContent, Grid, Typography, Box, Paper } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';

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
            <Container maxWidth="md" sx={{ mt: 4 }}>
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
        </ThemeProvider>
    );
}
