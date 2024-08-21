'use client'

import { useState } from 'react'
import { useUser } from "@clerk/nextjs";
import { db } from '@/firebase';
import { useRouter } from "next/navigation";
import { writeBatch, doc, collection, setDoc, getDoc } from 'firebase/firestore';
import { Container, Stack, Box, Typography, AppBar, Toolbar, Paper, TextField, Button, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Card, CardActionArea, CardContent } from '@mui/material';
import { SignedIn, SignedOut, UserButton, SignIn, SignUp } from "@clerk/nextjs";
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

    const handleGoHome = () => {
        router.push("/welcome");
      };
    
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

    // Example flashcards
    const exampleFlashcards = [
        { front: "What is the mitochondria?", back: "The powerhouse of the cell." },
        { front: "What is the Pythagorean theorem?", back: "In a right triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides." },
        { front: "What is React?", back: "A JavaScript library for building user interfaces." },
        { front: "How do you boil an egg?", back: "Place the eggs in a pot, cover with water, bring to a boil, then reduce to a simmer for 9-12 minutes." },
        { front: "What is DNA?", back: "Deoxyribonucleic acid, the molecule that carries genetic information in living organisms and viruses." },
        { front: "What is the Fibonacci sequence?", back: "A series of numbers where each number is the sum of the two preceding ones, often found in nature." }
    ];

    return (
        <ThemeProvider theme={theme}>
            <Box 
                sx={{
                    background: "linear-gradient(to bottom, #eaf4f4, #a9d6e5)", 
                    minHeight: '100vh', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: 4 
                }}
            >
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

                    {/* Example Flashcards */}
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" color="primary.main" fontWeight="bold" textAlign="center" mb={4}>
                            Example AI-Generated Flashcards
                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 4 }}>
                                {exampleFlashcards.map((flashcard, index) => (
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
                </Container>
            </Box>
        </ThemeProvider>
    );
}
