'use client'

import { useState } from 'react'
import { useUser } from "@clerk/nextjs";
import { db } from '@/firebase';
import { useRouter } from "next/navigation";
import { writeBatch, doc, collection, setDoc, getDoc } from 'firebase/firestore';
import { Container, Box, Typography, Paper, TextField, Button, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Card, CardActionArea, CardContent } from '@mui/material';
import zIndex from '@mui/material/styles/zIndex';

export default function Generate() {
    const {isLoaded, isSignedIn, user} = useUser();
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState('')
    const router = useRouter()

    const handleSubmit = async () => {
        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
            .then((res) => res.json())
            .then((data) => setFlashcards(data))
    }

    const handleCardClick = (id) => {
        setFlipped ((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }
    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert('Flashcards collection with the same name already exists.')
                return
            }
            else {
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        }
        else {
            batch.set(userDocRef, {flashcards: [{name}]})
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    return <Container maxWidth="md">
        <Box sx={{
            mt: 4, 
            mb: 6, 
            position: 'fixed', 
            bottom: '0px',
            flexDirection: 'column', 
            alignItems: 'center',
            backgroundColor: 'white',
            zIndex: 1
        }}
        >
            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column', width: '100%', height: '8vw'}}>
                <Typography variant="h4">
                    Generate Flashcards
                </Typography>
                <Box sx={{p: 2, display: 'flex', width: '100%', gap: '1vw'}}>
                    <TextField
                        value = {text}
                        onChange={(e) => setText(e.target.value)}
                        label="Enter Prompt"
                        
                        multiline
                        rows={1}
                        variant="outlined"
                        sx={{width: '36.5vw'}}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{mb: 2, width: '6.5vw', height: '3vw'}}
                        >
                            {' '}
                            Submit
                        </Button>
                </Box>
            </Paper>
        </Box>

        {flashcards.length > 0 && (
            <Box sx={{mt: 4, mb: 30}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5}}>
                    <Typography variant="h5">Flashcards Preview</Typography>
                    <Button variant="contained" color="secondary" onClick={handleOpen}>
                        Save
                    </Button>
                </Box>
                <Grid container spacing={3}>
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea 
                                    onClick={() => {
                                        handleCardClick(index)
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{
                                            perspective: '1000px',
                                            '& > div': {
                                                transition: 'transform 0.6s',
                                                transformStyle: 'preserve-3d',
                                                position: 'relative',
                                                width: '100%',
                                                backfaceVisibility: 'hidden',
                                                height: '200px',
                                                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                                                transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
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
                                            },
                                            '& > div > div:nth-of-type(2)': {
                                                transform: 'rotateY(180deg)',
                                            },
                                        }}
                                        >
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

        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Save Flashcards</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter a name for  your flashcards collection
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
                <Button onClick={handleClose}>
                    Cancel
                </Button>
                <Button onClick={saveFlashcards}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    </Container>
}