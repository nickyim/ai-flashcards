"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import {
  Container,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
  Stack,
  Fade,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

// Create a custom theme for Material-UI components
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
  // Get user information from Clerk
  const { isLoaded, isSignedIn, user } = useUser();
  // State to store flashcards
  const [flashcards, setFlashcards] = useState([]);
  // Router for navigation
  const router = useRouter();

  // Function to navigate to the home page
  const handleGoHome = () => {
    router.push("/welcome");
  };

  // Function to navigate to the generate flashcards page
  const handleGetStarted = () => {
    router.push("/generate");
  };

  // State to control the fade-in effect
  const [fadeIn, setFadeIn] = useState(false);

  // Effect to set the fade-in state when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      setFadeIn(true);
    }
  }, []);

  // Effect to fetch flashcards from Firestore when the user is loaded
  useEffect(() => {
    async function getFlashcards() {
      if (!user) return; // If user is not defined, return early
      const userDocRef = doc(db, "users", user.id); // Reference to the user's document in Firestore
      const docSnap = await getDoc(userDocRef); // Fetch the document

      if (docSnap.exists()) {
        const flashcards = docSnap.data().flashcards || []; // Get flashcards from the document data
        setFlashcards(flashcards); // Set the flashcards state
      }
    }
    getFlashcards();
  }, [user]); // Dependency array to run the effect when the user changes

  // If the user data is not loaded or the user is not signed in, return an empty fragment
  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  // Function to handle card click and navigate to the flashcard detail page
  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          background: "linear-gradient(to bottom, #eaf4f4, #a9d6e5)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
          mt: 6,
          flexGrow: 1,
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

        <Fade in={fadeIn} timeout={1000}>
          <Container maxWidth="md">
            <Stack
              directuino="column"
              spacing={6}
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                variant="h3"
                color="primary.main"
                fontWeight="bold"
                textAlign="center"
                mb={4}
              >
                My Collection
              </Typography>
              {flashcards.length === 0 ? (
                <Box sx={{ textAlign: "center", mt: 6 }}>
                  <Typography variant="h6" color="text.secondary">
                    No flashcards sets found. Start generating some flashcards!
                  </Typography>
                </Box>
              ) : (
                <Grid
                  container
                  spacing={3}
                  alignItems="center"
                  justifyContent="center"
                >
                  {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card>
                        <CardActionArea
                          onClick={() => handleCardClick(flashcard.name)}
                        >
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
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{
                  mt: 2,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  color: "#f6fff8",
                  "&:hover": {
                    backgroundColor: "#cce3de",
                    transform: "translateY(-2px)",
                    boxShadow: 3,
                    color: "secondary.dark",
                  },
                  transition: "all 0.3s",
                }}
                onClick={handleGetStarted}
              >
                Generate Flashcards
              </Button>
            </Stack>
          </Container>
        </Fade>
      </Box>
    </ThemeProvider>
  );
}
