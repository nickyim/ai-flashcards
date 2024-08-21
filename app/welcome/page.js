"use client";

import getStripe from "@/utils/get-stripe";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
  useUser,
} from "@clerk/nextjs";
import Head from "next/head";
import { db } from "@/firebase";
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
  Stack,
  Fade,
  Link,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, collection, getDoc } from "firebase/firestore";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6200EA",
      pro: "linear-gradient(to right, #eaf4f4, #a9d6e5)",
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

export default function WelcomePage() {
  const { openSignIn, openSignUp } = useClerk();
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        setLoading(false);
        return; // Ensure user is defined
      }
      const userDocRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const proMember = docSnap.data().isPro || false;
        setIsPremium(proMember);
      }
      setLoading(false);
    };

    checkStatus();
  }, [user]); // adding user to dependency array

  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000/welcome",
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
    router.push("/generate");
  };

  const handleGoHome = () => {
    router.push("/welcome");
  };

  const handleBackToCollection = () => {
    router.push("/flashcards");
  };

  const handleSignIn = () => {
    if (isSignedIn) {
      router.push("/welcome");
    } else {
      openSignIn({ afterSignInUrl: "/welcome" });
    }
  };

  const handleSignUp = () => {
    if (isSignedIn) {
      router.push("/welcome");
    } else {
      openSignUp({
        afterSignUpUrl: "/welcome",
        redirectUrl: "/welcome",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a more sophisticated loading indicator
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          background: "linear-gradient(to bottom, #eaf4f4, #a9d6e5)",
          minHeight: "100vh",
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
              <Link href="/" passHref color="inherit" underline="none">
                FlashAI
              </Link>
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
          <Container
            maxWidth="lg"
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
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
              <Typography
                variant="h3"
                gutterBottom
                fontWeight="bold"
                color="primary.main"
              >
                Thank you for choosing FlashAI!
              </Typography>
              <Typography
                variant="h6"
                gutterBottom
                color="text.secondary"
                className="fade-in-text"
              >
                Below you can find more information about our features and
                pricing. If you have any questions, do not hesitate to reach
                out!
              </Typography>
              <Stack
                direction="row"
                justifyContent="center"
                alignContent="center"
                spacing={5}
                mt={2}
              >
                <SignedOut>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={handleSignIn}
                    sx={{
                      mt: 2,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      color: "#f6fff8",
                      width: "200px",
                      "&:hover": {
                        backgroundColor: "#cce3de",
                        transform: "translateY(-2px)",
                        boxShadow: 3,
                        color: "secondary.dark",
                        maxWidth: "200px",
                      },
                      transition: "all 0.3s",
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={handleSignUp}
                    sx={{
                      mt: 2,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      color: "#f6fff8",
                      width: "200px",
                      "&:hover": {
                        backgroundColor: "#cce3de",
                        transform: "translateY(-2px)",
                        boxShadow: 3,
                        color: "secondary.dark",
                      },
                      transition: "all 0.3s",
                    }}
                  >
                    SignUp
                  </Button>
                </SignedOut>
                <SignedIn>
                  <Stack direction="row" spacing={2}>
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
                      onClick={handleBackToCollection}
                    >
                      Go to Your Collection
                    </Button>
                  </Stack>
                </SignedIn>
              </Stack>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h4"
                gutterBottom
                textAlign="center"
                color="primary.main"
                fontWeight="bold"
              >
                Features
              </Typography>
              <Grid container spacing={2}>
                {[
                  {
                    title: "Effortless Text Input",
                    content:
                      "Seamlessly input your text and let our advanced algorithms handle the rest, transforming your notes into study-ready flashcards.",
                  },
                  {
                    title: "Intelligent Flashcards",
                    content:
                      "Our cutting-edge AI breaks down your text into precise, easy-to-digest flashcards, ensuring you grasp key concepts quickly.",
                  },
                  {
                    title: "Universal Access",
                    content:
                      "Access your flashcards from any device, anytime, anywhere, and never miss a study session again.",
                  },
                ].map((feature, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        boxShadow: 3,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        backgroundColor: "white",
                        transition: "all 0.3s",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: 3,
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        color="secondary.main"
                        fontWeight="bold"
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body2">{feature.content}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              {!isPremium && (
                <Typography
                  variant="h4"
                  gutterBottom
                  color="primary.main"
                  fontWeight="bold"
                >
                  Pricing
                </Typography>
              )}
              {isPremium && (
                <Typography
                  variant="h4"
                  gutterBottom
                  // color="primary.pro"
                  fontWeight="bold"
                  sx={{
                    background: "linear-gradient(to right, #3f37c9, #0077b6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  Thank you to subscribing to our Pro plan! Enjoy all of our
                  Premium Features.
                </Typography>
              )}

              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent={isSignedIn ? "center" : "space-around"}
              >
                {!isSignedIn && (
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        boxShadow: 3,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        backgroundColor: "white",
                        transition: "all 0.3s",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: 3,
                        },
                      }}
                    >
                      <div>
                        <Typography
                          variant="h5"
                          gutterBottom
                          color="primary.main"
                          fontWeight="bold"
                        >
                          Basic
                        </Typography>
                        <Typography
                          variant="h6"
                          gutterBottom
                          color="secondary.main"
                        >
                          Free!
                        </Typography>
                        <Typography variant="body2">
                          Basic features and limited storage.
                        </Typography>
                      </div>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{
                          mt: 2,
                          "&:hover": {
                            backgroundColor: "primary.dark",
                          },
                        }}
                        onClick={handleSignUp}
                      >
                        Choose Basic
                      </Button>
                    </Box>
                  </Grid>
                )}{" "}
                {!isPremium && (
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        boxShadow: 3,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        backgroundColor: "white",
                        transition: "all 0.3s",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: 3,
                        },
                      }}
                    >
                      <div>
                        <Typography
                          variant="h5"
                          gutterBottom
                          color="primary.main"
                          fontWeight="bold"
                        >
                          Pro
                        </Typography>
                        <Typography
                          variant="h6"
                          gutterBottom
                          color="secondary.main"
                        >
                          $5 / month
                        </Typography>
                        <Typography variant="body2">
                          Unlimited flashcards and storage, with priority
                          support.
                        </Typography>
                      </div>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{
                          mt: 2,
                          "&:hover": {
                            backgroundColor: "primary.dark",
                          },
                        }}
                        onClick={handleSubmit}
                      >
                        Choose Pro
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Container>
        </Fade>
      </Box>
    </ThemeProvider>
  );
}
