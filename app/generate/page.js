'use client'

import { useState } from 'react'
import { useUser } from "@clerk/nextjs";
import { db } from '@/firebase';
import { useRouter } from "next/navigation";
import { writeBatch, doc, collection, setDoc, getDoc } from 'firebase/firestore';
import { Container, Box, Typography, Paper, TextField, Button, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Card, CardActionArea, CardContent } from '@mui/material';
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

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
            .then((res) => res.json())
            .then((data) => setFlashcards(data))
    };

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name');
            return;
        }

        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            if (collections.find((f) => f.name === name)) {
                alert('Flashcards collection with the same name already exists.');
                return;
            } else {
                collections.push({ name });
                batch.set(userDocRef, { flashcards: collections }, { merge: true });
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] });
        }

        const colRef = collection(userDocRef, name);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef);
            batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
        handleClose();
        router.push('/flashcards');
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box
                    sx={{
                        mt: 4,
                        mb: 6,
                        width: '100%',
                        backgroundColor: 'white',
                        zIndex: 1,
                    }}
                >
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            backgroundColor: 'background.default',
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="h4" color="primary.main" fontWeight="bold">
                            Generate Flashcards
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                width: '100%',
                                gap: 2,
                                mt: 2,
                                flexDirection: { xs: 'column', sm: 'row' },
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <TextField
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                label="Enter Prompt"
                                multiline
                                rows={1}
                                variant="outlined"
                                sx={{ flexGrow: 1, maxWidth: '400px' }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                sx={{ height: 'fit-content', mt: { xs: 2, sm: 0 } }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Paper>
                </Box>

                {flashcards.length > 0 && (
                    <Box sx={{ mt: 4, mb: 12 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 4,
                            }}
                        >
                            <Typography variant="h5" color="primary.main" fontWeight="bold">
                                Flashcards Preview
                            </Typography>
                            <Button variant="contained" color="secondary" onClick={handleOpen}>
                                Save
                            </Button>
                        </Box>
                        <Grid container spacing={2}>
                            {flashcards.map((flashcard, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card>
                                        <CardActionArea onClick={() => handleCardClick(index)}>
                                            <CardContent>
                                                <Box
                                                    sx={{
                                                        perspective: '1500px',
                                                        '& > div': {
                                                            transition: 'transform 0.6s',
                                                            transformStyle: 'preserve-3d',
                                                            position: 'relative',
                                                            width: '100%',
                                                            height: '200px',
                                                            backfaceVisibility: 'hidden',
                                                            transform: flipped[index] ? 'rotateX(180deg)' : 'rotateX(0deg)',
                                                            boxShadow: flipped[index]
                                                            ? '0px 4px 20px rgba(0, 0, 0, 0.2)'
                                                            : '0px 4px 10px rgba(0, 0, 0, 0.1)',                    
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
                                                            borderRadius: '4px',
                                                        },
                                                        '& > div > div:nth-of-type(1)': {
                                                            transform: 'rotateX(0deg)',
                                                            boxShadow: 'inset 0px 0px 5px rgba(0, 0, 0, 0.1)',
                                                        },                        
                                                        '& > div > div:nth-of-type(2)': {
                                                            transform: 'rotateX(180deg)',
                                                            boxShadow: 'inset 0px 0px 5px rgba(0, 0, 0, 0.1)',
                                                        },
                                                    }}
                                                >
                                                    <div>
                                                        <div>
                                                            <Typography variant="h6" color="primary.main">
                                                                {flashcard.front}
                                                            </Typography>
                                                        </div>
                                                        <div>
                                                            <Typography variant="h6" color="primary.main">
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

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Save Flashcards</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter a name for your flashcards collection
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Collection name"
                            type="text"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            variant="outlined"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={saveFlashcards} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
}
