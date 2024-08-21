"use client";

import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
  useUser,
} from "@clerk/nextjs";
import Head from "next/head";
import {
  Container,
  Toolbar,
  Typography,
  Button,
  AppBar,
  Box,
  Grid,
  ThemeProvider,
  createTheme,
  Fade,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  typography: {
    fontFamily: "Roboto, sans-serif",
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 500,
    },
    body2: {
      fontSize: "1rem",
    },
  },
});

export default function Home() {
  const { openSignIn, openSignUp } = useClerk();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);

  const redirectUrl = "/welcome";

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleSignIn = () => {
    if (isSignedIn) {
      router.push(redirectUrl);
    } else {
      openSignIn({ afterSignInUrl: redirectUrl });
    }
  };

  const handleSignUp = () => {
    if (isSignedIn) {
      router.push(redirectUrl);
    } else {
      openSignUp({
        afterSignUpUrl: redirectUrl,
        redirectUrl: redirectUrl,
      });
    }
  };

  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
      },
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  const handleGetStarted = () => {
    router.push("/welcome");
  };

  const handleMyCollection = () => {
    router.push("/flashcards");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          background: "linear-gradient(to bottom, #eaf4f4, #a9d6e5)",
          backgroundImage: "url('/bgUp3.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppBar position="static" sx={{ background: "primary.main" }}>
          <Toolbar variant="dense">
            <Typography
              variant="h6"
              style={{ flexGrow: 1, fontWeight: "bold" }}
            >
              FlashAI
            </Typography>
            <SignedOut>
              <Button
                color="inherit"
                onClick={handleSignIn}
                sx={{
                  mx: 1,
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                onClick={handleSignUp}
                sx={{
                  mx: 1,
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>
        <Container
          maxWidth="lg"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            py: 2,
            gap: 9,
          }}
        >
          <Head>
            <title>FlashAI</title>
            <meta
              name="description"
              content="Create flashcard from your text"
            />
          </Head>

          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Fade in={fadeIn} timeout={1500}>
              <div>
                <Typography
                  variant="h2"
                  gutterBottom
                  fontWeight="bold"
                  color="primary.main"
                >
                  Welcome to FlashAI
                </Typography>
                <Typography
                  variant="h5"
                  gutterBottom
                  color="text.secondary"
                  className="fade-in-text"
                >
                  Transform your text into smart flashcards effortlessly
                </Typography>

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
                  Get Started
                </Button>
              </div>
            </Fade>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
